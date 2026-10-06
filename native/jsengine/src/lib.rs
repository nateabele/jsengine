#[allow(unused_imports)]
mod atoms;
mod conv;
mod engine;
mod error;
mod isolate;
mod snapshot;
mod watchdog;

use crate::conv::{json_to_term, term_to_json};
use crate::engine::Request::{Call, CreateEnv, DestroyEnv, Load, Run};
use crate::engine::{EngineManager, EnvId, Request, Response};
use crate::isolate::{panic_message, Command, Failure, Isolate, Reply, ReplyFn};
use crate::snapshot::{Refused, StartupSnapshot};

use deno_core::serde_json::Value;
use rustler::env::OwnedEnv;
use rustler::{Binary, Encoder, Env, Error, NifResult, OwnedBinary, ResourceArc, Term};

use once_cell::sync::Lazy;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::sync::mpsc::{channel, Sender};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

rustler::init!(
    "Elixir.JSEngine",
    [
        create_env,
        destroy_env,
        load_env,
        run_env,
        call_env,
        isolate_new,
        isolate_load,
        isolate_call,
        isolate_destroy,
        isolate_alive,
        isolate_cancel,
        isolate_test_panic,
        isolate_test_stall,
        snapshot_create,
        snapshot_info,
        snapshot_to_binary,
        snapshot_from_binary,
        isolate_new_from_snapshot
    ],
    load = init
);

/// The NIF resource behind `JSEngine.create_isolate/1`. Garbage collection
/// of the last reference shuts the isolate thread down.
pub struct IsolateResource(Isolate);

/// The NIF resource behind `JSEngine.create_snapshot/3` (D54): a V8 startup
/// snapshot of a loaded bundle, shared by every isolate started from it.
pub struct SnapshotResource(Arc<StartupSnapshot>);

/// One per request. `JSEngine` cancels it when it stops waiting, and a
/// cancelled request sends no reply, so a late answer never lands in the
/// caller's mailbox. The mutex makes check-and-send atomic with cancel.
pub struct ReplyTicket(Mutex<bool>);

type ChannelSender = Arc<Mutex<Sender<(Request, Sender<Response>)>>>;

static GLOBAL_CHANNEL: Lazy<ChannelSender> = Lazy::new(|| {
    let (sender, receiver) = channel::<(Request, Sender<Response>)>();
    let sender = Arc::new(Mutex::new(sender));
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .expect("Failed to create Tokio runtime - this should never fail");

    /* Spawn the master thread */
    thread::spawn(move || {
        let mut engine_manager = EngineManager::new();

        for (request, response_sender) in receiver {
            let async_result = engine_manager.handle(&request);
            let result = runtime.block_on(async_result);
            let _ = response_sender.send(result);
        }
    });

    sender
});

// rustler 0.30's resource! macro expands to an impl inside this function.
#[allow(non_local_definitions)]
fn init(env: Env, _term: rustler::Term) -> bool {
    rustler::resource!(IsolateResource, env);
    rustler::resource!(ReplyTicket, env);
    rustler::resource!(SnapshotResource, env);
    true
}

// Helper function to extract environment ID from term (supports atom :default or integer)
fn extract_env_id<'a>(_env: Env<'a>, term: Term<'a>) -> Result<EnvId, Error> {
    // Try to decode as atom first (for :default)
    if term.is_atom() && atoms::default().eq(&term) {
        return Ok(0);
    }

    // Try to decode as integer (for environment references)
    term.decode::<u64>()
        .map_err(|_| Error::Atom("invalid_env_id"))
}

#[rustler::nif(schedule = "DirtyCpu")]
fn create_env<'a>(env: Env<'a>) -> NifResult<Term<'a>> {
    send_msg_raw(env, CreateEnv)
}

#[rustler::nif(schedule = "DirtyCpu")]
fn destroy_env<'a>(env: Env<'a>, env_id_term: Term<'a>) -> NifResult<Term<'a>> {
    let env_id = extract_env_id(env, env_id_term)?;
    send_msg_raw(env, DestroyEnv(env_id))
}

#[rustler::nif(schedule = "DirtyCpu")]
fn load_env<'a>(env: Env<'a>, env_id_term: Term<'a>, js_files: Vec<String>) -> NifResult<Term<'a>> {
    let env_id = extract_env_id(env, env_id_term)?;
    send_msg_raw(env, Load(env_id, js_files))
}

#[rustler::nif(schedule = "DirtyCpu")]
fn run_env<'a>(env: Env<'a>, env_id_term: Term<'a>, code: String) -> NifResult<Term<'a>> {
    let env_id = extract_env_id(env, env_id_term)?;
    send_msg_raw(env, Run(env_id, code))
}

#[rustler::nif(schedule = "DirtyCpu")]
fn call_env<'a>(
    env: Env<'a>,
    env_id_term: Term<'a>,
    fn_name: String,
    args: Vec<Term<'a>>,
) -> NifResult<Term<'a>> {
    let env_id = extract_env_id(env, env_id_term)?;
    let json_args: Result<Vec<Value>, _> =
        args.into_iter().map(|arg| term_to_json(env, arg)).collect();

    match json_args {
        Ok(arg_vals) => send_msg_raw(env, Call(env_id, fn_name, arg_vals)),
        Err(_err) => Err(Error::Atom("invalid_type")),
    }
}

fn send_msg_raw<'a>(env: Env<'a>, msg: Request) -> NifResult<Term<'a>> {
    let (sender, receiver) = channel::<Response>();
    // Clone the sender and release the global mutex before waiting, so a
    // caller blocked on a reply never holds the lock.
    let global_sender = GLOBAL_CHANNEL
        .lock()
        .map_err(|_| Error::Atom("mutex_poisoned"))?
        .clone();

    global_sender
        .send((msg, sender))
        .map_err(|_| Error::Atom("sender_error"))?;

    let response = receiver.recv().map_err(|_| Error::Atom("receiver_error"))?;

    match response {
        Response::EnvCreated(id) => Ok((atoms::ok(), id).encode(env)),
        Response::EnvDestroyed => Ok(atoms::ok().encode(env)),
        Response::Result(Ok(val)) => Ok((atoms::ok(), json_to_term(env, &val)).encode(env)),
        Response::Result(Err(err)) => Ok((atoms::error(), json_to_term(env, &err)).encode(env)),
    }
}

// ---------------------------------------------------------------------------
// Hardened isolates (F2). Each isolate runs on its own OS thread. Requests are
// queued without waiting; the isolate thread sends
// `{:jsengine_reply, tag, result}` to the calling process when it is done.
// ---------------------------------------------------------------------------

/// Runs a NIF body and turns a Rust panic into `{:error, {:panic, msg}}`.
fn guard<'a>(env: Env<'a>, body: impl FnOnce() -> Term<'a>) -> Term<'a> {
    match catch_unwind(AssertUnwindSafe(body)) {
        Ok(term) => term,
        Err(payload) => error_term(env, &Failure::Panic(panic_message(&*payload))),
    }
}

fn failure_term<'a>(env: Env<'a>, failure: &Failure) -> Term<'a> {
    match failure {
        Failure::Timeout => atoms::timeout().encode(env),
        Failure::Oom => atoms::oom().encode(env),
        Failure::Dead => atoms::dead().encode(env),
        Failure::Panic(message) => (atoms::panic_(), message.as_str()).encode(env),
        Failure::Js(message) => (atoms::js(), message.as_str()).encode(env),
    }
}

fn error_term<'a>(env: Env<'a>, failure: &Failure) -> Term<'a> {
    (atoms::error(), failure_term(env, failure)).encode(env)
}

fn reply_term<'a>(env: Env<'a>, reply: &Reply) -> Term<'a> {
    match reply {
        Reply::Loaded => atoms::ok().encode(env),
        Reply::Value(json) => (atoms::ok(), json.as_str()).encode(env),
        Reply::Failed(failure) => error_term(env, failure),
    }
}

/// A reply function that sends `{:jsengine_reply, tag, result}` to the
/// process that made the request, unless `ticket` was cancelled. It runs on
/// the isolate thread.
fn replier(env: Env, tag: Term, ticket: ResourceArc<ReplyTicket>) -> ReplyFn {
    let pid = env.pid();
    let owned = OwnedEnv::new();
    let saved_tag = owned.save(tag);
    Box::new(move |reply: Reply| {
        let cancelled = ticket.0.lock().unwrap_or_else(|p| p.into_inner());
        if *cancelled {
            return;
        }
        let mut owned = owned;
        let _ = owned.send_and_clear(&pid, |env| {
            (atoms::jsengine_reply(), saved_tag.load(env), reply_term(env, &reply)).encode(env)
        });
    })
}

/// Queues the command built by `make` and returns `{:ok, ticket}`.
fn queued<'a>(
    env: Env<'a>,
    resource: &IsolateResource,
    tag: Term<'a>,
    make: impl FnOnce(ReplyFn) -> Command,
) -> Term<'a> {
    let ticket = ResourceArc::new(ReplyTicket(Mutex::new(false)));
    match resource.0.submit(make(replier(env, tag, ticket.clone()))) {
        Ok(()) => (atoms::ok(), ticket).encode(env),
        Err(failure) => error_term(env, &failure),
    }
}

#[rustler::nif(schedule = "DirtyCpu")]
fn isolate_new(env: Env, heap_mb: u64) -> Term {
    guard(env, || match Isolate::spawn(heap_mb as usize) {
        Ok(isolate) => (atoms::ok(), ResourceArc::new(IsolateResource(isolate))).encode(env),
        Err(failure) => error_term(env, &failure),
    })
}

#[rustler::nif(schedule = "DirtyCpu")]
fn isolate_load<'a>(
    env: Env<'a>,
    resource: ResourceArc<IsolateResource>,
    name: String,
    code: String,
    timeout_ms: u64,
    tag: Term<'a>,
) -> Term<'a> {
    guard(env, || {
        queued(env, &resource, tag, |reply| Command::Load {
            name,
            code,
            timeout: Duration::from_millis(timeout_ms),
            reply,
        })
    })
}

// Dirty: decoding and copying a multi-MB `args_json` must not hold a normal
// scheduler.
#[rustler::nif(schedule = "DirtyCpu")]
fn isolate_call<'a>(
    env: Env<'a>,
    resource: ResourceArc<IsolateResource>,
    fun: String,
    args_json: String,
    timeout_ms: u64,
    tag: Term<'a>,
) -> Term<'a> {
    guard(env, || {
        queued(env, &resource, tag, |reply| Command::Call {
            fun,
            args_json,
            timeout: Duration::from_millis(timeout_ms),
            reply,
        })
    })
}

#[rustler::nif(schedule = "DirtyIo")]
fn isolate_destroy(env: Env, resource: ResourceArc<IsolateResource>) -> Term {
    guard(env, || {
        resource.0.shutdown(Some(Duration::from_secs(2)));
        atoms::ok().encode(env)
    })
}

#[rustler::nif]
fn isolate_alive(env: Env, resource: ResourceArc<IsolateResource>) -> Term {
    guard(env, || resource.0.is_alive().encode(env))
}

#[rustler::nif]
fn isolate_cancel(env: Env, ticket: ResourceArc<ReplyTicket>) -> Term {
    guard(env, || {
        *ticket.0.lock().unwrap_or_else(|p| p.into_inner()) = true;
        atoms::ok().encode(env)
    })
}

#[rustler::nif]
fn isolate_test_panic<'a>(
    env: Env<'a>,
    resource: ResourceArc<IsolateResource>,
    tag: Term<'a>,
) -> Term<'a> {
    guard(env, || {
        if cfg!(feature = "test_hooks") {
            queued(env, &resource, tag, |reply| Command::Panic { reply })
        } else {
            (atoms::error(), atoms::unsupported()).encode(env)
        }
    })
}

#[rustler::nif]
fn isolate_test_stall<'a>(
    env: Env<'a>,
    resource: ResourceArc<IsolateResource>,
    stall_ms: u64,
    timeout_ms: u64,
    tag: Term<'a>,
) -> Term<'a> {
    guard(env, || {
        if cfg!(feature = "test_hooks") {
            queued(env, &resource, tag, |reply| Command::Stall {
                stall: Duration::from_millis(stall_ms),
                timeout: Duration::from_millis(timeout_ms),
                reply,
            })
        } else {
            (atoms::error(), atoms::unsupported()).encode(env)
        }
    })
}

// ---------------------------------------------------------------------------
// Startup snapshots (D54). A snapshot is made once per bundle and per NIF
// build; isolates started from it skip loading the bundle.
// ---------------------------------------------------------------------------

/// Runs `code` once and snapshots the heap. Blocks a dirty scheduler for
/// about as long as a load of `code` plus the serialisation.
#[rustler::nif(schedule = "DirtyCpu")]
fn snapshot_create(env: Env, name: String, code: String, timeout_ms: u64) -> Term {
    guard(env, || {
        let timeout = Duration::from_millis(timeout_ms).min(isolate::MAX_TIMEOUT);
        match snapshot::create(&name, code, timeout) {
            Ok(snapshot) => (
                atoms::ok(),
                ResourceArc::new(SnapshotResource(Arc::new(snapshot))),
            )
                .encode(env),
            Err(failure) => error_term(env, &failure),
        }
    })
}

/// `%{bundle_sha256: hex, size: bytes, build_id: string}`.
#[rustler::nif]
fn snapshot_info(env: Env, resource: ResourceArc<SnapshotResource>) -> Term {
    guard(env, || {
        let hex: String = resource
            .0
            .bundle_sha256()
            .iter()
            .map(|b| format!("{b:02x}"))
            .collect();
        let map = Term::map_new(env);
        map.map_put(atoms::bundle_sha256().encode(env), hex.encode(env))
            .and_then(|m| m.map_put(atoms::size().encode(env), resource.0.size().encode(env)))
            .and_then(|m| m.map_put(atoms::build_id().encode(env), snapshot::build_id().encode(env)))
            .unwrap_or_else(|_| error_term(env, &Failure::Panic("cannot build the info map".into())))
    })
}

/// The snapshot as a binary for a cache, stamped with this build's id.
#[rustler::nif(schedule = "DirtyCpu")]
fn snapshot_to_binary(env: Env, resource: ResourceArc<SnapshotResource>) -> Term {
    guard(env, || {
        let bytes = resource.0.to_bytes();
        match OwnedBinary::new(bytes.len()) {
            Some(mut binary) => {
                binary.as_mut_slice().copy_from_slice(&bytes);
                (atoms::ok(), binary.release(env)).encode(env)
            }
            None => error_term(env, &Failure::Oom),
        }
    })
}

/// `{:ok, snapshot}`, or `{:error, :stale}` for another build's bytes and
/// `{:error, :corrupt}` for damaged ones. V8 never sees refused bytes.
#[rustler::nif(schedule = "DirtyCpu")]
fn snapshot_from_binary<'a>(env: Env<'a>, bytes: Binary<'a>) -> Term<'a> {
    guard(env, || match StartupSnapshot::from_bytes(bytes.as_slice()) {
        Ok(snapshot) => (
            atoms::ok(),
            ResourceArc::new(SnapshotResource(Arc::new(snapshot))),
        )
            .encode(env),
        Err(Refused::Stale) => (atoms::error(), atoms::stale()).encode(env),
        Err(Refused::Corrupt) => (atoms::error(), atoms::corrupt()).encode(env),
    })
}

#[rustler::nif(schedule = "DirtyCpu")]
fn isolate_new_from_snapshot(
    env: Env,
    heap_mb: u64,
    resource: ResourceArc<SnapshotResource>,
) -> Term {
    guard(env, || {
        match Isolate::spawn_from(heap_mb as usize, Some(resource.0.clone())) {
            Ok(isolate) => (atoms::ok(), ResourceArc::new(IsolateResource(isolate))).encode(env),
            Err(failure) => error_term(env, &failure),
        }
    })
}
