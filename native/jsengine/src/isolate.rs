//! A hardened V8 isolate: one OS thread per isolate, a heap limit, a
//! deadline per request, and panic containment.
//!
//! Every request gets exactly one `Reply`. A `Timeout`, `Oom`, `Panic` or
//! `Dead` reply means the isolate has been discarded: its thread drops the
//! runtime, answers every queued request with `Dead`, and exits. The owner
//! creates a new isolate to recover.

use crate::engine::new_runtime;
use crate::watchdog;
use deno_core::error::JsError;
use deno_core::{v8, FastString, JsRuntime};
use once_cell::sync::Lazy;
use std::any::Any;
use std::collections::HashSet;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering::SeqCst};
use std::sync::mpsc::{channel, Receiver, Sender};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

/// Why a request did not produce a value.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Failure {
    Timeout,
    Oom,
    Panic(String),
    Js(String),
    Dead,
}

impl Failure {
    /// True when the isolate is discarded after this failure.
    pub fn is_fatal(&self) -> bool {
        !matches!(self, Failure::Js(_))
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Reply {
    Loaded,
    Value(String),
    Failed(Failure),
}

pub type ReplyFn = Box<dyn FnOnce(Reply) + Send + 'static>;

pub enum Command {
    /// Runs `code` as a classic script. Never transpiled, never sniffed.
    Load {
        name: String,
        code: String,
        timeout: Duration,
        reply: ReplyFn,
    },
    /// Calls `globalThis[fun](...JSON.parse(args_json))`, awaits a returned
    /// promise, and replies with `JSON.stringify` of the result.
    Call {
        fun: String,
        args_json: String,
        timeout: Duration,
        reply: ReplyFn,
    },
    /// Panics on the isolate thread (exposed to Elixir only with the
    /// `test_hooks` feature).
    Panic { reply: ReplyFn },
    Shutdown { ack: Option<Sender<()>> },
}

enum Job {
    Load { name: String, code: String },
    Call { fun: String, args_json: String },
    Panic,
}

/// State shared by the isolate thread, the watchdog and the NIF side.
pub struct Shared {
    handle: v8::IsolateHandle,
    active_call: Mutex<u64>,
    timed_out: AtomicBool,
    oom: AtomicBool,
    destroyed: AtomicBool,
    dead: AtomicBool,
}

static NEXT_CALL: AtomicU64 = AtomicU64::new(1);

impl Shared {
    fn begin_call(&self) -> u64 {
        let seq = NEXT_CALL.fetch_add(1, SeqCst);
        *self.active_call.lock().unwrap_or_else(|p| p.into_inner()) = seq;
        seq
    }

    fn end_call(&self) {
        *self.active_call.lock().unwrap_or_else(|p| p.into_inner()) = 0;
    }

    /// Called by the watchdog when the deadline of call `seq` passes.
    pub(crate) fn expire(&self, seq: u64) {
        let active = self.active_call.lock().unwrap_or_else(|p| p.into_inner());
        if *active == seq {
            self.timed_out.store(true, SeqCst);
            self.handle.terminate_execution();
        }
    }
}

/// The owner's handle to an isolate thread. Dropping it shuts the thread down.
pub struct Isolate {
    sender: Arc<Mutex<Option<Sender<Command>>>>,
    shared: Arc<Shared>,
}

impl Isolate {
    /// Starts a new isolate thread with a heap limit of `heap_mb` MiB and
    /// waits until its runtime exists.
    pub fn spawn(heap_mb: usize) -> Result<Isolate, Failure> {
        let (sender, receiver) = channel::<Command>();
        let (ready_tx, ready_rx) = channel::<Result<Arc<Shared>, Failure>>();
        let slot = Arc::new(Mutex::new(Some(sender)));
        let thread_slot = slot.clone();
        std::thread::Builder::new()
            .name("jsengine-isolate".into())
            .stack_size(8 * 1024 * 1024)
            .spawn(move || isolate_thread(heap_mb, receiver, ready_tx, thread_slot))
            .map_err(|e| Failure::Panic(format!("cannot spawn isolate thread: {e}")))?;
        match ready_rx.recv() {
            Ok(Ok(shared)) => Ok(Isolate {
                sender: slot,
                shared,
            }),
            Ok(Err(failure)) => Err(failure),
            Err(_) => Err(Failure::Panic("isolate thread exited while starting".into())),
        }
    }

    /// Queues a command. Never blocks on JavaScript: the lock only guards a
    /// non-blocking channel send. `Err(Dead)` means the command was dropped
    /// unanswered, so the caller must report `Dead` itself.
    pub fn submit(&self, command: Command) -> Result<(), Failure> {
        let guard = self.sender.lock().map_err(|_| Failure::Dead)?;
        match guard.as_ref() {
            Some(sender) => sender.send(command).map_err(|_| Failure::Dead),
            None => Err(Failure::Dead),
        }
    }

    pub fn is_alive(&self) -> bool {
        !self.shared.dead.load(SeqCst)
    }

    /// Stops a running call, discards the isolate, and (when `wait` is set)
    /// waits up to `wait` for the thread to release the heap.
    pub fn shutdown(&self, wait: Option<Duration>) {
        self.shared.destroyed.store(true, SeqCst);
        self.shared.handle.terminate_execution();
        let (ack_tx, ack_rx) = channel::<()>();
        let ack = wait.map(|_| ack_tx);
        if self.submit(Command::Shutdown { ack }).is_ok() {
            if let Some(wait) = wait {
                let _ = ack_rx.recv_timeout(wait);
            }
        }
    }
}

impl Drop for Isolate {
    fn drop(&mut self) {
        self.shutdown(None);
    }
}

pub fn panic_message(payload: &(dyn Any + Send)) -> String {
    if let Some(text) = payload.downcast_ref::<&str>() {
        (*text).to_string()
    } else if let Some(text) = payload.downcast_ref::<String>() {
        text.clone()
    } else {
        "unknown panic payload".to_string()
    }
}

fn split(command: Command) -> Result<(ReplyFn, Duration, Job), Option<Sender<()>>> {
    match command {
        Command::Load {
            name,
            code,
            timeout,
            reply,
        } => Ok((reply, timeout, Job::Load { name, code })),
        Command::Call {
            fun,
            args_json,
            timeout,
            reply,
        } => Ok((reply, timeout, Job::Call { fun, args_json })),
        Command::Panic { reply } => Ok((reply, Duration::from_secs(5), Job::Panic)),
        Command::Shutdown { ack } => Err(ack),
    }
}

type Parts = (JsRuntime, Arc<Shared>, tokio::runtime::Runtime);

fn start(heap_mb: usize) -> Result<Parts, Failure> {
    let tokio_rt = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .map_err(|e| Failure::Panic(format!("cannot build tokio runtime: {e}")))?;
    let heap_bytes = heap_mb.max(16).saturating_mul(1024 * 1024);
    let params = v8::CreateParams::default().heap_limits(0, heap_bytes);
    let mut runtime = {
        let _enter = tokio_rt.enter();
        new_runtime(Some(params)).map_err(|e| Failure::Js(e.to_string()))?
    };
    let handle = runtime.v8_isolate().thread_safe_handle();
    let shared = Arc::new(Shared {
        handle,
        active_call: Mutex::new(0),
        timed_out: AtomicBool::new(false),
        oom: AtomicBool::new(false),
        destroyed: AtomicBool::new(false),
        dead: AtomicBool::new(false),
    });
    let on_limit = shared.clone();
    runtime.add_near_heap_limit_callback(move |current, _initial| {
        on_limit.oom.store(true, SeqCst);
        on_limit.handle.terminate_execution();
        // Headroom so V8 can unwind the terminated script instead of aborting.
        current.saturating_mul(2)
    });
    Ok((runtime, shared, tokio_rt))
}

fn isolate_thread(
    heap_mb: usize,
    receiver: Receiver<Command>,
    ready: Sender<Result<Arc<Shared>, Failure>>,
    slot: Arc<Mutex<Option<Sender<Command>>>>,
) {
    let (mut runtime, shared, tokio_rt) = match catch_unwind(AssertUnwindSafe(|| start(heap_mb))) {
        Ok(Ok(parts)) => parts,
        Ok(Err(failure)) => {
            let _ = ready.send(Err(failure));
            return;
        }
        Err(payload) => {
            let _ = ready.send(Err(Failure::Panic(panic_message(&*payload))));
            return;
        }
    };
    let _ = ready.send(Ok(shared.clone()));

    let mut final_ack = None;
    for command in receiver.iter() {
        let (reply, timeout, job) = match split(command) {
            Ok(parts) => parts,
            Err(ack) => {
                final_ack = ack;
                break;
            }
        };
        let outcome = catch_unwind(AssertUnwindSafe(|| {
            execute(&mut runtime, &tokio_rt, &shared, timeout, job)
        }));
        let result = match outcome {
            Ok(result) => result,
            Err(payload) => Reply::Failed(Failure::Panic(panic_message(&*payload))),
        };
        let fatal = matches!(&result, Reply::Failed(f) if f.is_fatal());
        reply(result);
        if fatal {
            break;
        }
    }

    // Retire: refuse new commands, free the heap, answer what was queued.
    shared.dead.store(true, SeqCst);
    if let Ok(mut sender) = slot.lock() {
        *sender = None;
    }
    {
        let _enter = tokio_rt.enter();
        let _ = catch_unwind(AssertUnwindSafe(move || drop(runtime)));
    }
    for command in receiver.try_iter() {
        match split(command) {
            Ok((reply, _, _)) => reply(Reply::Failed(Failure::Dead)),
            Err(Some(ack)) => {
                let _ = ack.send(());
            }
            Err(None) => {}
        }
    }
    if let Some(ack) = final_ack {
        let _ = ack.send(());
    }
}

fn execute(
    runtime: &mut JsRuntime,
    tokio_rt: &tokio::runtime::Runtime,
    shared: &Arc<Shared>,
    timeout: Duration,
    job: Job,
) -> Reply {
    if shared.destroyed.load(SeqCst) {
        return Reply::Failed(Failure::Dead);
    }
    let deadline = Instant::now() + timeout;
    let seq = shared.begin_call();
    watchdog::arm(deadline, shared.clone(), seq);
    let outcome: Result<Reply, String> = match job {
        Job::Load { name, code } => load_script(runtime, &name, code).map(|()| Reply::Loaded),
        Job::Call { fun, args_json } => tokio_rt.block_on(async {
            let limit = tokio::time::Instant::from_std(deadline);
            match tokio::time::timeout_at(limit, call_function(runtime, &fun, &args_json)).await
            {
                Ok(result) => result.map(Reply::Value),
                Err(_elapsed) => {
                    shared.timed_out.store(true, SeqCst);
                    Err("deadline passed while awaiting the result".to_string())
                }
            }
        }),
        Job::Panic => panic!("jsengine test hook: deliberate panic"),
    };
    shared.end_call();
    classify(shared, outcome)
}

fn classify(shared: &Shared, outcome: Result<Reply, String>) -> Reply {
    if shared.destroyed.load(SeqCst) {
        Reply::Failed(Failure::Dead)
    } else if shared.oom.load(SeqCst) {
        Reply::Failed(Failure::Oom)
    } else if shared.timed_out.load(SeqCst) {
        Reply::Failed(Failure::Timeout)
    } else {
        match outcome {
            Ok(reply) => reply,
            Err(message) => Reply::Failed(Failure::Js(message)),
        }
    }
}

static SCRIPT_NAMES: Lazy<Mutex<HashSet<&'static str>>> = Lazy::new(|| Mutex::new(HashSet::new()));

/// deno_core wants a `&'static str` ASCII script name. Names are interned,
/// so loading the same bundle name again leaks nothing new.
fn script_name(name: &str) -> &'static str {
    let ascii: String = name
        .chars()
        .map(|c| if c.is_ascii() && !c.is_ascii_control() { c } else { '_' })
        .collect();
    let mut names = SCRIPT_NAMES.lock().unwrap_or_else(|p| p.into_inner());
    if let Some(existing) = names.get(ascii.as_str()) {
        return existing;
    }
    let leaked: &'static str = Box::leak(ascii.into_boxed_str());
    names.insert(leaked);
    leaked
}

fn load_script(runtime: &mut JsRuntime, name: &str, code: String) -> Result<(), String> {
    runtime
        .execute_script(script_name(name), FastString::from(code))
        .map(|_| ())
        .map_err(|e| e.to_string())
}

fn exception_text(scope: &mut v8::TryCatch<v8::HandleScope>, fallback: &str) -> String {
    match scope.exception() {
        Some(exception) => JsError::from_v8_exception(scope, exception).to_string(),
        None => fallback.to_string(),
    }
}

async fn call_function(
    runtime: &mut JsRuntime,
    fun: &str,
    args_json: &str,
) -> Result<String, String> {
    let pending = {
        let scope = &mut runtime.handle_scope();
        let scope = &mut v8::TryCatch::new(scope);
        let context = scope.get_current_context();
        let global = context.global(scope);
        let key = v8::String::new(scope, fun).ok_or_else(|| "function name too long".to_string())?;
        let value = match global.get(scope, key.into()) {
            Some(value) => value,
            None => return Err(exception_text(scope, "function lookup failed")),
        };
        let func = v8::Local::<v8::Function>::try_from(value)
            .map_err(|_| format!("{fun} is not a function"))?;
        let json = v8::String::new(scope, args_json).ok_or_else(|| "args_json too long".to_string())?;
        let parsed = match v8::json::parse(scope, json) {
            Some(parsed) => parsed,
            None => return Err(exception_text(scope, "args_json is not valid JSON")),
        };
        let array = v8::Local::<v8::Array>::try_from(parsed)
            .map_err(|_| "args_json must be a JSON array".to_string())?;
        let mut args: Vec<v8::Local<v8::Value>> = Vec::with_capacity(array.length() as usize);
        for index in 0..array.length() {
            let arg = match array.get_index(scope, index) {
                Some(arg) => arg,
                None => v8::undefined(scope).into(),
            };
            args.push(arg);
        }
        let result = match func.call(scope, global.into(), &args) {
            Some(result) => result,
            None => return Err(exception_text(scope, "call failed")),
        };
        v8::Global::new(scope, result)
    };
    let settled = runtime.resolve_value(pending).await.map_err(|e| e.to_string())?;
    let scope = &mut runtime.handle_scope();
    let scope = &mut v8::TryCatch::new(scope);
    let local = v8::Local::new(scope, settled);
    if local.is_undefined() || local.is_function() || local.is_symbol() {
        return Ok("null".to_string());
    }
    match v8::json::stringify(scope, local) {
        Some(text) => Ok(text.to_rust_string_lossy(scope)),
        None => Err(exception_text(scope, "result is not JSON-serializable")),
    }
}

#[cfg(test)]
#[path = "isolate_tests.rs"]
mod tests;
