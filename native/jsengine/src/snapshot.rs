//! V8 startup snapshots of a loaded bundle (D54).
//!
//! `create` runs a bundle once in a snapshotting runtime and serialises the
//! resulting heap. `Isolate::spawn_from` then starts an isolate from that
//! heap instead of loading the bundle again, so its top-level code (Elm's
//! top-level constants) is never evaluated again.
//!
//! A snapshot holds only what the bundle builds at load: the context is
//! taken right after the script ran, before any call, and every isolate
//! started from it gets its own copy of the heap.
//!
//! A snapshot is valid only for the binary that made it: same V8, same ops
//! in the same order, same `runtime.js`, same V8 flags. `to_bytes` stamps
//! the build id of this NIF, and `from_bytes` refuses another build's bytes
//! (V8 aborts the process on a snapshot it cannot read, so this check must
//! come first).
//!
//! V8 cannot serialise every heap, and it aborts the process (it does not
//! return an error) when it meets one of these at snapshot time:
//!   * an exported WebAssembly function (a wasm instance made at load);
//!   * a FinalizationRegistry with pending cleanup (a registered target that
//!     was collected during the load).
//!
//! Neither can be detected cheaply before serialising, so a bundle given to
//! `create` must not instantiate WebAssembly or register finalizers at load.
//! asm.js is safe: deno_core runs V8 with `--no-validate-asm`, so an
//! `"use asm"` module is plain JavaScript (tested).

use crate::engine::{bootstrap, host_extensions};
use crate::isolate::{panic_message, script_name, Failure};
use deno_core::futures::task::noop_waker;
use deno_core::{v8, FastString, JsRuntime, JsRuntimeForSnapshot, RuntimeOptions};
use sha2::{Digest, Sha256};
use std::ffi::c_void;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::sync::atomic::{AtomicBool, Ordering::SeqCst};
use std::sync::mpsc::channel;
use std::sync::Arc;
use std::task::{Context, Poll};
use std::time::Duration;

/// The build id of this NIF binary (see build.rs).
pub const BUILD_ID: &str = env!("JSENGINE_BUILD_ID");

const MAGIC: &[u8; 8] = b"JSESNAP1";

/// A V8 startup snapshot of one bundle, made by this NIF binary.
pub struct StartupSnapshot {
    bundle_sha256: [u8; 32],
    blob: Arc<[u8]>,
}

/// Why stored snapshot bytes were refused.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Refused {
    /// Made by another build of jsengine (or another V8): make it again.
    Stale,
    /// Not a snapshot, truncated, or the payload does not match its checksum.
    Corrupt,
}

impl StartupSnapshot {
    /// SHA-256 of the bundle source the snapshot was made from.
    pub fn bundle_sha256(&self) -> [u8; 32] {
        self.bundle_sha256
    }

    /// Size of the V8 snapshot blob in bytes.
    pub fn size(&self) -> usize {
        self.blob.len()
    }

    /// The blob for one runtime, without a copy: every isolate started from
    /// this snapshot reads the same bytes.
    ///
    /// # Safety
    /// V8 keeps a pointer to the blob for the life of the isolate. The caller
    /// must keep `self` alive until the runtime built from the result has
    /// been dropped.
    pub(crate) unsafe fn startup_data(&self) -> deno_core::Snapshot {
        // SAFETY: the caller outlives the runtime (see above); the blob is
        // immutable and owned by an Arc that is never mutated.
        let blob: &'static [u8] = unsafe { &*(self.blob.as_ref() as *const [u8]) };
        deno_core::Snapshot::Static(blob)
    }

    /// The snapshot as bytes for a cache: magic, build id, bundle hash,
    /// payload hash, payload length, payload.
    pub fn to_bytes(&self) -> Vec<u8> {
        let id = build_id();
        let mut out = Vec::with_capacity(self.blob.len() + id.len() + 96);
        out.extend_from_slice(MAGIC);
        out.extend_from_slice(&(id.len() as u32).to_le_bytes());
        out.extend_from_slice(id.as_bytes());
        out.extend_from_slice(&self.bundle_sha256);
        out.extend_from_slice(&Sha256::digest(&self.blob));
        out.extend_from_slice(&(self.blob.len() as u64).to_le_bytes());
        out.extend_from_slice(&self.blob);
        out
    }

    /// Reads bytes written by `to_bytes`. Refuses bytes of another build
    /// (`Stale`) and damaged bytes (`Corrupt`) before V8 ever sees them.
    pub fn from_bytes(bytes: &[u8]) -> Result<StartupSnapshot, Refused> {
        let mut rest = bytes;
        let mut take = |n: usize| -> Result<&[u8], Refused> {
            if rest.len() < n {
                return Err(Refused::Corrupt);
            }
            let (head, tail) = rest.split_at(n);
            rest = tail;
            Ok(head)
        };
        if take(8)? != MAGIC {
            return Err(Refused::Corrupt);
        }
        let id_len = u32::from_le_bytes(take(4)?.try_into().unwrap()) as usize;
        let id = take(id_len)?;
        if id != build_id().as_bytes() {
            return Err(Refused::Stale);
        }
        let bundle_sha256: [u8; 32] = take(32)?.try_into().unwrap();
        let payload_sha256: [u8; 32] = take(32)?.try_into().unwrap();
        let len = u64::from_le_bytes(take(8)?.try_into().unwrap()) as usize;
        let blob = take(len)?;
        if !rest.is_empty() || Sha256::digest(blob)[..] != payload_sha256[..] {
            return Err(Refused::Corrupt);
        }
        Ok(StartupSnapshot {
            bundle_sha256,
            blob: Arc::from(blob),
        })
    }
}

/// This binary's build id plus the V8 version: the key half that is not the
/// bundle.
pub fn build_id() -> String {
    format!("{BUILD_ID}/v8-{}", v8::V8::get_version())
}

/// SHA-256 of `code`: the bundle half of a snapshot's key.
pub fn bundle_sha256(code: &str) -> [u8; 32] {
    Sha256::digest(code.as_bytes()).into()
}

/// Runs `code` (as `load_source` would, after the host bootstrap) in a
/// snapshotting runtime on a thread of its own, and snapshots the heap.
///
/// Refused (`Js`): a script that throws, and a script that leaves async work
/// pending (a timer or an op started at load): a snapshot cannot carry it,
/// so an isolate started from it would differ from one that loaded the code.
/// A script that runs past `timeout` is stopped (`Timeout`); one whose heap
/// grows past `heap_mb` MiB is stopped (`Oom`). See the module doc for the
/// bundles V8 cannot snapshot at all.
pub fn create(
    name: &str,
    code: String,
    timeout: Duration,
    heap_mb: usize,
) -> Result<StartupSnapshot, Failure> {
    let name = script_name(name);
    let (tx, rx) = channel();
    std::thread::Builder::new()
        .name("jsengine-snapshot".into())
        .stack_size(8 * 1024 * 1024)
        .spawn(move || {
            let result = catch_unwind(AssertUnwindSafe(|| {
                snapshot_thread(name, code, timeout, heap_mb)
            }))
            .unwrap_or_else(|payload| Err(Failure::Panic(panic_message(&*payload))));
            let _ = tx.send(result);
        })
        .map_err(|e| Failure::Panic(format!("cannot spawn snapshot thread: {e}")))?;
    rx.recv().unwrap_or_else(|_| {
        Err(Failure::Panic(
            "snapshot thread exited without a result".into(),
        ))
    })
}

fn snapshot_thread(
    name: &'static str,
    code: String,
    timeout: Duration,
    heap_mb: usize,
) -> Result<StartupSnapshot, Failure> {
    // The first runtime of a process initialises V8, and a snapshotting one
    // would do it with `--predictable --random-seed=42` for the whole BEAM
    // (single-threaded GC and compiler, the same Math.random sequence in
    // every isolate). Initialise it the normal way first; later calls are
    // no-ops, so the snapshot is made under the flags that will read it.
    JsRuntime::init_platform(None);

    let bundle_sha256 = bundle_sha256(&code);
    let tokio_rt = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .map_err(|e| Failure::Panic(format!("cannot build tokio runtime: {e}")))?;
    let _enter = tokio_rt.enter();

    let mut runtime = JsRuntimeForSnapshot::new(RuntimeOptions {
        extensions: host_extensions(),
        ..Default::default()
    });
    bootstrap(&mut runtime)
        .map_err(|e| Failure::Panic(format!("cannot start the runtime: {e}")))?;

    // Heap cap. deno_core ignores `create_params` for a snapshotting runtime,
    // so V8 would only stop at its default limit, with a fatal OOM that ends
    // the BEAM. A GC prologue callback stops the script once the heap passes
    // `heap_mb`; the near-heap-limit callback is the backstop at V8's own
    // limit. Both terminate execution and the result is `Oom`.
    let guard = Box::new(HeapGuard {
        cap_bytes: heap_mb.max(16).saturating_mul(1024 * 1024),
        handle: runtime.v8_isolate().thread_safe_handle(),
        oom: AtomicBool::new(false),
    });
    let guard_ptr = &*guard as *const HeapGuard as *mut c_void;
    runtime
        .v8_isolate()
        .add_gc_prologue_callback(heap_guard_on_gc, guard_ptr, v8::GCType::ALL);
    runtime
        .v8_isolate()
        .add_near_heap_limit_callback(heap_guard_near_limit, guard_ptr);

    // Deadline: the snapshotting isolate is not a hardened one, so it gets a
    // timer of its own.
    let handle = runtime.v8_isolate().thread_safe_handle();
    let timed_out = Arc::new(AtomicBool::new(false));
    let (done_tx, done_rx) = channel::<()>();
    let flag = timed_out.clone();
    let timer = std::thread::spawn(move || {
        if done_rx.recv_timeout(timeout) == Err(std::sync::mpsc::RecvTimeoutError::Timeout) {
            flag.store(true, SeqCst);
            handle.terminate_execution();
        }
    });

    let loaded = tokio_rt
        .block_on(async { runtime.execute_script(name, FastString::from(code)) })
        .map(|_| ())
        .map_err(|e| e.to_string())
        .and_then(|()| no_pending_work(&mut runtime));
    let _ = done_tx.send(());
    let _ = timer.join();

    let failure = if guard.oom.load(SeqCst) {
        Some(Failure::Oom)
    } else if timed_out.load(SeqCst) {
        Some(Failure::Timeout)
    } else {
        loaded.err().map(Failure::Js)
    };
    if failure.is_some() {
        runtime.v8_isolate().cancel_terminate_execution();
    }
    // The callbacks point at `guard`: remove them before the runtime goes.
    runtime
        .v8_isolate()
        .remove_gc_prologue_callback(heap_guard_on_gc, guard_ptr);
    runtime
        .v8_isolate()
        .remove_near_heap_limit_callback(heap_guard_near_limit, 0);
    // Always consume the runtime through `snapshot`: dropping a snapshotting
    // runtime leaks its isolate.
    let blob = runtime.snapshot();
    drop(guard);
    match failure {
        Some(failure) => Err(failure),
        None => Ok(StartupSnapshot {
            bundle_sha256,
            blob: Arc::from(&*blob),
        }),
    }
}

/// The heap cap of a snapshotting isolate (see `snapshot_thread`).
struct HeapGuard {
    cap_bytes: usize,
    handle: v8::IsolateHandle,
    oom: AtomicBool,
}

impl HeapGuard {
    fn trip(&self) {
        self.oom.store(true, SeqCst);
        self.handle.terminate_execution();
    }
}

// V8 calls these from extern "C" frames, where an unwinding panic aborts the
// process: the bodies cannot panic, and catch_unwind makes sure.
extern "C" fn heap_guard_on_gc(
    isolate: *mut v8::Isolate,
    _type: v8::GCType,
    _flags: v8::GCCallbackFlags,
    data: *mut c_void,
) {
    let _ = catch_unwind(AssertUnwindSafe(|| {
        // SAFETY: `data` is the HeapGuard that outlives the registration, and
        // V8 passes the isolate it runs this callback on.
        let (guard, isolate) = unsafe { (&*(data as *const HeapGuard), &mut *isolate) };
        let mut stats = v8::HeapStatistics::default();
        isolate.get_heap_statistics(&mut stats);
        if stats.used_heap_size() > guard.cap_bytes {
            guard.trip();
        }
    }));
}

extern "C" fn heap_guard_near_limit(data: *mut c_void, current: usize, _initial: usize) -> usize {
    let _ = catch_unwind(AssertUnwindSafe(|| {
        // SAFETY: as above.
        unsafe { &*(data as *const HeapGuard) }.trip();
    }));
    // Headroom so V8 can unwind the terminated script instead of aborting.
    current.saturating_mul(2)
}

/// Polls the event loop once: nothing may be left to run.
fn no_pending_work(runtime: &mut JsRuntime) -> Result<(), String> {
    let waker = noop_waker();
    let mut cx = Context::from_waker(&waker);
    match runtime.poll_event_loop(&mut cx, false) {
        Poll::Ready(Ok(())) => Ok(()),
        Poll::Ready(Err(e)) => Err(e.to_string()),
        Poll::Pending => Err(
            "the script left async work pending at load (a timer or an op); it cannot be snapshotted"
                .to_string(),
        ),
    }
}

#[cfg(test)]
#[path = "snapshot_tests.rs"]
mod tests;
