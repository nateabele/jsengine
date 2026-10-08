//! Tests of the hardened isolate (no BEAM needed): `cargo test`.

use super::*;

const TIMEOUT: Duration = Duration::from_secs(10);

fn request(isolate: &Isolate, make: impl FnOnce(ReplyFn) -> Command) -> Reply {
    let (tx, rx) = channel::<Reply>();
    let reply: ReplyFn = Box::new(move |r| {
        let _ = tx.send(r);
    });
    match isolate.submit(make(reply)) {
        Ok(()) => rx.recv_timeout(Duration::from_secs(30)).expect("no reply within 30 s"),
        Err(failure) => Reply::Failed(failure),
    }
}

pub(crate) fn load(isolate: &Isolate, code: &str) -> Reply {
    let code = code.to_string();
    request(isolate, |reply| Command::Load {
        name: "test.js".into(),
        code,
        timeout: TIMEOUT,
        reply,
    })
}

pub(crate) fn call(isolate: &Isolate, fun: &str, args_json: &str, timeout: Duration) -> Reply {
    let (fun, args_json) = (fun.to_string(), args_json.to_string());
    request(isolate, |reply| Command::Call {
        fun,
        args_json,
        timeout,
        reply,
    })
}

#[test]
fn loads_a_script_and_calls_a_function_with_json() {
    let isolate = Isolate::spawn(64).expect("spawn");
    assert_eq!(load(&isolate, "globalThis.add = (a, b) => a + b;"), Reply::Loaded);
    assert_eq!(call(&isolate, "add", "[1, 2]", TIMEOUT), Reply::Value("3".into()));
}

#[test]
fn spinning_javascript_times_out_and_kills_only_that_isolate() {
    let a = Isolate::spawn(64).expect("spawn a");
    let b = Isolate::spawn(64).expect("spawn b");
    load(&a, "globalThis.spin = () => { while (true) {} };");
    load(&b, "globalThis.one = () => 1;");
    let started = Instant::now();
    assert_eq!(call(&a, "spin", "[]", Duration::from_millis(300)), Reply::Failed(Failure::Timeout));
    assert!(started.elapsed() < Duration::from_secs(3));
    assert!(!a.is_alive());
    assert_eq!(call(&a, "spin", "[]", TIMEOUT), Reply::Failed(Failure::Dead));
    assert_eq!(call(&b, "one", "[]", TIMEOUT), Reply::Value("1".into()));
}

#[test]
fn heap_exhaustion_returns_oom_instead_of_aborting() {
    let isolate = Isolate::spawn(64).expect("spawn");
    load(&isolate, "globalThis.hog = () => { const a = []; for (;;) a.push(new Array(100000).fill(1.5)); };");
    assert_eq!(call(&isolate, "hog", "[]", Duration::from_secs(30)), Reply::Failed(Failure::Oom));
    assert!(!isolate.is_alive());
}

#[test]
fn a_panic_on_the_isolate_thread_is_a_reply() {
    let isolate = Isolate::spawn(64).expect("spawn");
    let reply = request(&isolate, |reply| Command::Panic { reply });
    assert_eq!(reply, Reply::Failed(Failure::Panic("jsengine test hook: deliberate panic".into())));
    assert!(!isolate.is_alive());
    let fresh = Isolate::spawn(64).expect("respawn");
    load(&fresh, "globalThis.one = () => 1;");
    assert_eq!(call(&fresh, "one", "[]", TIMEOUT), Reply::Value("1".into()));
}

#[test]
fn a_slow_call_in_one_isolate_does_not_delay_another() {
    let a = std::sync::Arc::new(Isolate::spawn(64).expect("spawn a"));
    let b = Isolate::spawn(64).expect("spawn b");
    load(&a, "globalThis.busy = (ms) => { const end = Date.now() + ms; while (Date.now() < end) {} return ms; };");
    load(&b, "globalThis.one = () => 1;");
    let slow = {
        let a = a.clone();
        std::thread::spawn(move || call(&a, "busy", "[700]", TIMEOUT))
    };
    std::thread::sleep(Duration::from_millis(50));
    let started = Instant::now();
    assert_eq!(call(&b, "one", "[]", TIMEOUT), Reply::Value("1".into()));
    assert!(started.elapsed() < Duration::from_millis(100), "blocked {:?}", started.elapsed());
    assert_eq!(slow.join().unwrap(), Reply::Value("700".into()));
}

#[test]
fn a_js_exception_is_a_js_failure_and_the_isolate_lives() {
    let isolate = Isolate::spawn(64).expect("spawn");
    load(&isolate, "globalThis.boom = () => { throw new Error('nope'); }; globalThis.one = () => 1;");
    match call(&isolate, "boom", "[]", TIMEOUT) {
        Reply::Failed(Failure::Js(message)) => assert!(message.contains("nope"), "{message}"),
        other => panic!("expected a JS failure, got {other:?}"),
    }
    match call(&isolate, "missing", "[]", TIMEOUT) {
        Reply::Failed(Failure::Js(message)) => assert!(message.contains("missing is not a function"), "{message}"),
        other => panic!("expected a JS failure, got {other:?}"),
    }
    match call(&isolate, "one", "{not json", TIMEOUT) {
        Reply::Failed(Failure::Js(_)) => {}
        other => panic!("expected a JS failure, got {other:?}"),
    }
    match call(&isolate, "one", "{}", TIMEOUT) {
        Reply::Failed(Failure::Js(message)) => assert_eq!(message, "args_json must be a JSON array"),
        other => panic!("expected a JS failure, got {other:?}"),
    }
    assert!(isolate.is_alive());
    assert_eq!(call(&isolate, "one", "[]", TIMEOUT), Reply::Value("1".into()));
}

#[test]
fn promises_and_set_timeout_are_awaited() {
    let isolate = Isolate::spawn(64).expect("spawn");
    load(&isolate, "globalThis.later = (v) => new Promise((r) => setTimeout(() => r({v}), 10)); globalThis.nothing = () => undefined;");
    assert_eq!(call(&isolate, "later", "[\"x\"]", TIMEOUT), Reply::Value("{\"v\":\"x\"}".into()));
    assert_eq!(call(&isolate, "nothing", "[]", TIMEOUT), Reply::Value("null".into()));
}

#[test]
fn an_idle_wait_past_the_deadline_times_out() {
    let isolate = Isolate::spawn(64).expect("spawn");
    load(&isolate, "globalThis.wait = () => new Promise((r) => setTimeout(r, 60000));");
    let started = Instant::now();
    assert_eq!(call(&isolate, "wait", "[]", Duration::from_millis(200)), Reply::Failed(Failure::Timeout));
    assert!(started.elapsed() < Duration::from_secs(2));
}

#[test]
fn load_never_guesses_typescript_or_modules() {
    let isolate = Isolate::spawn(64).expect("spawn");
    let code = "var f = 1, g = 2, h = 0; var marker = '): export import '; globalThis.probe = () => (f < g > (h));";
    assert_eq!(load(&isolate, code), Reply::Loaded);
    assert_eq!(call(&isolate, "probe", "[]", TIMEOUT), Reply::Value("true".into()));
}

#[test]
fn spinning_load_times_out() {
    let isolate = Isolate::spawn(64).expect("spawn");
    let reply = request(&isolate, |reply| Command::Load { name: "spin.js".into(), code: "while (true) {}".into(), timeout: Duration::from_millis(200), reply });
    assert_eq!(reply, Reply::Failed(Failure::Timeout));
}

#[test]
fn shutdown_answers_queued_requests_with_dead() {
    let isolate = Isolate::spawn(64).expect("spawn");
    load(&isolate, "globalThis.one = () => 1;");
    isolate.shutdown(Some(Duration::from_secs(2)));
    assert!(!isolate.is_alive());
    assert_eq!(call(&isolate, "one", "[]", TIMEOUT), Reply::Failed(Failure::Dead));
}

#[test]
fn a_load_that_calls_set_timeout_at_top_level_does_not_abort() {
    let isolate = Isolate::spawn(64).expect("spawn");
    assert_eq!(
        load(&isolate, "globalThis.fired = false; setTimeout(() => { globalThis.fired = true; }, 0); globalThis.check = () => fired;"),
        Reply::Loaded
    );
    assert!(isolate.is_alive());
    let later = "globalThis.settle = () => new Promise((r) => setTimeout(() => r(fired), 20));";
    assert_eq!(load(&isolate, later), Reply::Loaded);
    assert_eq!(call(&isolate, "settle", "[]", TIMEOUT), Reply::Value("true".into()));
}

#[test]
fn set_timeout_with_odd_delays_never_kills_the_isolate() {
    let isolate = Isolate::spawn(64).expect("spawn");
    for code in ["setTimeout(() => {}, -1);", "setTimeout(() => {}, 1e300);", "setTimeout(() => {}, NaN);", "setTimeout(() => {}, 'x');"] {
        match load(&isolate, code) {
            Reply::Loaded | Reply::Failed(Failure::Js(_)) => {}
            other => panic!("{code}: expected Loaded or a JS failure, got {other:?}"),
        }
        assert!(isolate.is_alive(), "{code} killed the isolate");
    }
    load(&isolate, "globalThis.one = () => 1;");
    assert_eq!(call(&isolate, "one", "[]", TIMEOUT), Reply::Value("1".into()));
}

#[test]
fn finished_calls_leave_no_watchdog_entries() {
    let isolate = Isolate::spawn(64).expect("spawn");
    load(&isolate, "globalThis.one = () => 1;");
    for _ in 0..500 {
        assert_eq!(call(&isolate, "one", "[]", Duration::from_secs(600)), Reply::Value("1".into()));
    }
    // Other tests run concurrently and may hold a few live entries.
    let pending = crate::watchdog::pending();
    assert!(pending < 50, "{pending} watchdog entries left after 500 finished calls");
}

#[test]
fn a_huge_timeout_is_clamped_instead_of_overflowing() {
    let isolate = Isolate::spawn(64).expect("spawn");
    load(&isolate, "globalThis.one = () => 1;");
    assert_eq!(call(&isolate, "one", "[]", Duration::MAX), Reply::Value("1".into()));
    assert!(isolate.is_alive());
}

/// The heap of an isolate made by `start`: (heap_size_limit, the old-generation budget left after
/// the young generation is taken out of it). V8's limit is 2 semi-spaces + a new large-object space
/// of one semi-space + the old generation.
fn heap_limits_of(heap_mb: usize, snapshot: Option<&crate::snapshot::StartupSnapshot>) -> (usize, usize) {
    let (mut runtime, _shared, tokio_rt) = start(heap_mb, snapshot).expect("start");
    let mut stats = v8::HeapStatistics::default();
    runtime.v8_isolate().get_heap_statistics(&mut stats);
    let limit = stats.heap_size_limit();
    {
        let _enter = tokio_rt.enter();
        drop(runtime);
    }
    (limit, limit.saturating_sub(3 * crate::engine::SEMI_SPACE_MB * 1024 * 1024))
}

#[test]
fn every_isolate_gets_the_young_generation_and_keeps_its_old_generation_budget() {
    const MB: usize = 1024 * 1024;
    let snapshot = crate::snapshot::create("young.js", "globalThis.one = () => 1;".into(), TIMEOUT, 256)
        .expect("snapshot");
    for heap_mb in [16, 64, 256] {
        let (limit, old) = heap_limits_of(heap_mb, None);
        // Before the flag, V8 split `heap_mb` into a 1 MiB semi-space (3 MiB young generation)
        // and the rest: the old generation keeps that budget, page-rounded (256 KiB).
        let before = heap_mb * MB - 3 * MB;
        assert!(
            old <= before && before - old < 256 * 1024,
            "heap_mb {heap_mb}: limit {limit}, old-generation budget {old}, expected about {before}"
        );
        // An isolate started from a snapshot gets the same heap.
        assert_eq!(heap_limits_of(heap_mb, Some(&snapshot)), (limit, old), "heap_mb {heap_mb}");
    }
    // The isolate that made the snapshot has no `heap_limits` (deno_core ignores create_params
    // for it), so V8 gives it its default 700 MiB x 2 (no pointer compression) old generation;
    // its young generation is jsengine's (without the flag it would be V8's default 16 MiB
    // semi-space, 48 MiB).
    assert_eq!(
        crate::snapshot::SNAPSHOT_HEAP_LIMIT.load(SeqCst),
        1400 * MB + 3 * crate::engine::SEMI_SPACE_MB * MB,
        "heap_size_limit of the snapshotting isolate"
    );
}

/// Timer probes shared with the snapshot tests: each returns a promise that
/// settles once its timers are done.
pub(crate) const TIMER_PROBES: &str = r#"
globalThis.timerId = () => { const a = setTimeout(() => {}, 0), b = setTimeout(() => {}, 0); return [typeof a, b - a]; };
globalThis.cleared = () => new Promise((r) => {
  let fired = false;
  const id = setTimeout(() => { fired = true; }, 5);
  clearTimeout(id);
  setTimeout(() => r(fired), 40);
});
globalThis.inOrder = () => new Promise((r) => {
  const seen = [];
  setTimeout(() => seen.push("c"), 30);
  setTimeout(() => seen.push("a"), 1);
  const dropped = setTimeout(() => seen.push("x"), 15);
  setTimeout(() => seen.push("b"), 15);
  clearTimeout(dropped);
  setTimeout((p, q) => seen.push(p + q), 45, "d", "!");
  setTimeout(() => r(seen), 60);
});
globalThis.noops = () => new Promise((r) => {
  const seen = [];
  clearTimeout(undefined); clearTimeout(); clearTimeout(null); clearTimeout(987654321); clearTimeout("nope");
  const fired = setTimeout(() => seen.push("first"), 1);
  const other = setTimeout(() => seen.push("other"), 30);
  setTimeout(() => { clearTimeout(fired); clearTimeout(fired); seen.push("cleared a fired id"); }, 10);
  setTimeout(() => r(seen), 50);
});
globalThis.rearm = () => new Promise((r) => {
  const seen = [];
  const self = setTimeout(() => {
    clearTimeout(self);
    seen.push("self");
    setTimeout(() => { seen.push("rearmed"); r(seen); }, 5);
  }, 1);
});
globalThis.throwLater = () => { globalThis.thrownId = setTimeout(() => { throw new Error("boom"); }, 1); return typeof thrownId; };
globalThis.wait = (ms) => new Promise((r) => setTimeout(() => r(ms), ms));
globalThis.afterThrow = () => new Promise((r) => {
  clearTimeout(globalThis.thrownId);
  setTimeout(() => r("fired after the throw"), 5);
});
"#;

pub(crate) fn assert_timer_probes(isolate: &Isolate) {
    assert_eq!(call(isolate, "timerId", "[]", TIMEOUT), Reply::Value(r#"["number",1]"#.into()));
    assert_eq!(call(isolate, "cleared", "[]", TIMEOUT), Reply::Value("false".into()));
    assert_eq!(call(isolate, "inOrder", "[]", TIMEOUT), Reply::Value(r#"["a","b","c","d!"]"#.into()));
    assert_eq!(
        call(isolate, "noops", "[]", TIMEOUT),
        Reply::Value(r#"["first","cleared a fired id","other"]"#.into())
    );
    assert_eq!(call(isolate, "rearm", "[]", TIMEOUT), Reply::Value(r#"["self","rearmed"]"#.into()));
    // A throwing handler is an unhandled rejection: it fails the call in
    // flight when it fires (as before clearTimeout), and the isolate lives.
    assert_eq!(call(isolate, "throwLater", "[]", TIMEOUT), Reply::Value(r#""number""#.into()));
    match call(isolate, "wait", "[30]", TIMEOUT) {
        Reply::Failed(Failure::Js(message)) => assert!(message.contains("boom"), "{message}"),
        other => panic!("expected the handler's error, got {other:?}"),
    }
    assert_eq!(call(isolate, "afterThrow", "[]", TIMEOUT), Reply::Value(r#""fired after the throw""#.into()));
    assert_eq!(call(isolate, "wait", "[5]", TIMEOUT), Reply::Value("5".into()));
}

#[test]
fn clear_timeout_cancels_and_uncleared_timers_fire_in_order() {
    let isolate = Isolate::spawn(64).expect("spawn");
    assert_eq!(load(&isolate, TIMER_PROBES), Reply::Loaded);
    assert_timer_probes(&isolate);
}

/// Used heap after a full GC (what the `LowMemory` test hook does).
fn used_after_gc(runtime: &mut JsRuntime) -> usize {
    runtime.v8_isolate().low_memory_notification();
    let mut stats = v8::HeapStatistics::default();
    runtime.v8_isolate().get_heap_statistics(&mut stats);
    stats.used_heap_size()
}

/// Arms 200 one-minute timers, each closing over 200 KB, then clears them:
/// after a GC the heap must be back where it started. The interop `invoke`
/// leak (aravis cold start, 100k entries) was exactly these closures.
pub(crate) fn assert_cleared_closures_are_released(snapshot: Option<&crate::snapshot::StartupSnapshot>) {
    const MB: usize = 1024 * 1024;
    let (mut runtime, _shared, tokio_rt) = start(256, snapshot).expect("start");
    {
        let _enter = tokio_rt.enter();
        let base = used_after_gc(&mut runtime);
        runtime
            .execute_script_static(
                "arm.js",
                "globalThis.ids = []; for (let i = 0; i < 200; i++) { const big = new Array(25000).fill(i + 0.5); ids.push(setTimeout(() => big.length, 60000)); }",
            )
            .expect("arm");
        let armed = used_after_gc(&mut runtime);
        runtime
            .execute_script_static("clear.js", "for (const id of globalThis.ids) clearTimeout(id); globalThis.ids = null;")
            .expect("clear");
        let cleared = used_after_gc(&mut runtime);
        println!("[clear-timeout] used heap KB: base {}, armed {}, cleared {}", base / 1024, armed / 1024, cleared / 1024);
        assert!(armed > base + 30 * MB, "the closures were not retained while armed: {base} -> {armed}");
        assert!(cleared < base + 2 * MB, "cleared timers still hold their closures: base {base}, cleared {cleared}");
        // The Rust-side sleeps are cancelled, not left to run out their minute:
        // the event loop has nothing left to wait for.
        let drained = tokio_rt.block_on(async {
            tokio::time::timeout(Duration::from_secs(5), runtime.run_event_loop(Default::default())).await
        });
        assert!(matches!(drained, Ok(Ok(()))), "cleared timers left async work pending");
    }
    let _enter = tokio_rt.enter();
    drop(runtime);
}

#[test]
fn clear_timeout_releases_the_closure_at_once() {
    assert_cleared_closures_are_released(None);
}

/// A handler that throws leaves no timer entry behind: its 40 MB closure is
/// released, and a later timer still fires. deno_core keeps the thrown error
/// (whose stack frames reference the handler) until the next event-loop
/// turn, so the heap is measured after a later timer has run.
pub(crate) fn assert_a_thrown_handler_is_released(snapshot: Option<&crate::snapshot::StartupSnapshot>) {
    const MB: usize = 1024 * 1024;
    let (mut runtime, _shared, tokio_rt) = start(256, snapshot).expect("start");
    {
        let _enter = tokio_rt.enter();
        let base = used_after_gc(&mut runtime);
        runtime
            .execute_script_static(
                "throw.js",
                "{ const big = new Array(5000000).fill(0.5); globalThis.thrownId = setTimeout(() => { throw new Error('boom ' + big.length); }, 1); }",
            )
            .expect("arm");
        let armed = used_after_gc(&mut runtime);
        let thrown = tokio_rt.block_on(async {
            tokio::time::timeout(Duration::from_secs(5), runtime.run_event_loop(Default::default())).await
        });
        match thrown {
            Ok(Err(e)) => assert!(e.to_string().contains("boom 5000000"), "{e}"),
            other => panic!("expected the handler's error, got {other:?}"),
        }
        let after_throw = used_after_gc(&mut runtime);
        runtime
            .execute_script_static(
                "later.js",
                "globalThis.later = false; setTimeout(() => { globalThis.later = true; }, 1);",
            )
            .expect("later");
        let drained = tokio_rt.block_on(async {
            tokio::time::timeout(Duration::from_secs(5), runtime.run_event_loop(Default::default())).await
        });
        assert!(matches!(drained, Ok(Ok(()))), "the later timer did not settle");
        let after = used_after_gc(&mut runtime);
        println!("[clear-timeout] thrown handler, used heap KB: base {}, armed {}, after the throw {}, after a later timer {}", base / 1024, armed / 1024, after_throw / 1024, after / 1024);
        assert!(armed > base + 30 * MB, "the closure was not retained while armed: {base} -> {armed}");
        assert!(after < base + 2 * MB, "a thrown handler's closure is still held: base {base}, after {after}");
        // Clearing the thrown timer's id is a no-op: its entry is gone.
        let later = runtime
            .execute_script_static("check.js", "clearTimeout(globalThis.thrownId); globalThis.later")
            .expect("check");
        let scope = &mut runtime.handle_scope();
        assert!(v8::Local::new(scope, later).is_true(), "the later timer did not fire");
    }
    let _enter = tokio_rt.enter();
    drop(runtime);
}

#[test]
fn a_throwing_handler_is_released_and_later_timers_fire() {
    assert_a_thrown_handler_is_released(None);
}

// ---------------------------------------------------------------------------
// Low-memory notification (`JSEngine.low_memory_notification/2`).
// ---------------------------------------------------------------------------

const MB: usize = 1024 * 1024;

/// Builds 40 MB of arrays, then drops them: garbage that V8 keeps until a
/// major GC (jsengine runs no idle tasks, so nothing else collects it).
const CHURN: &str = r#"
globalThis.fill = () => { globalThis.hold = []; for (let i = 0; i < 200; i++) hold.push(new Array(25000).fill(i + 0.5)); return hold.length; };
globalThis.release = () => { globalThis.hold = null; return 0; };
globalThis.one = () => 1;
globalThis.wait = (ms) => new Promise((r) => setTimeout(() => r(ms), ms));
"#;

pub(crate) fn low_memory(isolate: &Isolate) -> Reply {
    request(isolate, |reply| Command::LowMemory { reply })
}

fn last_low_memory(isolate: &Isolate) -> (usize, usize) {
    *isolate.shared.low_memory_log.lock().unwrap().last().expect("no notification ran")
}

/// On an isolate that made and dropped 40 MB, the notification replies `Done`
/// and the heap's physical size falls by most of it; a second one right
/// after frees nothing more. The isolate keeps its state.
pub(crate) fn assert_low_memory_frees_a_worked_isolate(isolate: &Isolate) {
    if load(isolate, CHURN) != Reply::Loaded {
        panic!("churn did not load");
    }
    assert_eq!(call(isolate, "fill", "[]", TIMEOUT), Reply::Value("200".into()));
    assert_eq!(call(isolate, "release", "[]", TIMEOUT), Reply::Value("0".into()));
    let started = Instant::now();
    assert_eq!(low_memory(isolate), Reply::Done);
    let took = started.elapsed();
    let (before, after) = last_low_memory(isolate);
    println!("[low-memory] worked isolate: heap physical {} -> {} KB in {took:?}", before / 1024, after / 1024);
    assert!(before > after + 30 * MB, "the notification freed too little: {before} -> {after}");
    assert_eq!(low_memory(isolate), Reply::Done);
    let (again_before, again_after) = last_low_memory(isolate);
    assert!(again_before < after + 2 * MB && again_after <= again_before + MB, "{again_before} -> {again_after}");
    assert!(isolate.is_alive());
    assert_eq!(call(isolate, "one", "[]", TIMEOUT), Reply::Value("1".into()));
}

#[test]
fn a_low_memory_notification_frees_a_worked_isolates_garbage() {
    let isolate = Isolate::spawn(256).expect("spawn");
    assert_low_memory_frees_a_worked_isolate(&isolate);
}

#[test]
fn a_low_memory_notification_on_a_fresh_isolate_is_a_fast_no_op() {
    let isolate = Isolate::spawn(256).expect("spawn");
    let started = Instant::now();
    assert_eq!(low_memory(&isolate), Reply::Done);
    let took = started.elapsed();
    let (before, after) = last_low_memory(&isolate);
    println!("[low-memory] fresh isolate: heap physical {} -> {} KB in {took:?}", before / 1024, after / 1024);
    // About 2 ms measured; the bound only catches a pathological cost.
    assert!(took < Duration::from_millis(250), "{took:?}");
    assert!(before < after + 2 * MB, "a fresh isolate had garbage to free: {before} -> {after}");
    assert!(isolate.is_alive());
}

#[test]
fn a_low_memory_notification_to_a_destroyed_isolate_is_dead() {
    let isolate = Isolate::spawn(64).expect("spawn");
    isolate.shutdown(Some(Duration::from_secs(2)));
    assert_eq!(low_memory(&isolate), Reply::Failed(Failure::Dead));
    let retired = Isolate::spawn(64).expect("spawn");
    load(&retired, "globalThis.spin = () => { while (true) {} };");
    assert_eq!(call(&retired, "spin", "[]", Duration::from_millis(100)), Reply::Failed(Failure::Timeout));
    assert_eq!(low_memory(&retired), Reply::Failed(Failure::Dead));
}

/// The notification waits in the queue behind a call in flight, and a call
/// queued after it waits for it: replies come back in submission order.
#[test]
fn a_low_memory_notification_queues_behind_a_call_in_flight() {
    let isolate = Isolate::spawn(256).expect("spawn");
    assert_eq!(load(&isolate, CHURN), Reply::Loaded);
    assert_eq!(call(&isolate, "fill", "[]", TIMEOUT), Reply::Value("200".into()));
    let (tx, rx) = channel::<(&'static str, Reply, Instant)>();
    let sender = |label: &'static str| -> ReplyFn {
        let tx = tx.clone();
        Box::new(move |r| {
            let _ = tx.send((label, r, Instant::now()));
        })
    };
    let started = Instant::now();
    isolate
        .submit(Command::Call { fun: "wait".into(), args_json: "[200]".into(), timeout: TIMEOUT, reply: sender("wait") })
        .expect("submit wait");
    isolate.submit(Command::LowMemory { reply: sender("gc") }).expect("submit gc");
    isolate
        .submit(Command::Call { fun: "release".into(), args_json: "[]".into(), timeout: TIMEOUT, reply: sender("release") })
        .expect("submit release");
    let replies: Vec<_> = (0..3).map(|_| rx.recv_timeout(Duration::from_secs(30)).expect("reply")).collect();
    let order: Vec<_> = replies.iter().map(|(label, _, _)| *label).collect();
    assert_eq!(order, ["wait", "gc", "release"]);
    assert_eq!(replies[0].1, Reply::Value("200".into()));
    assert_eq!(replies[1].1, Reply::Done);
    assert_eq!(replies[2].1, Reply::Value("0".into()));
    assert!(replies[1].2.duration_since(started) >= Duration::from_millis(200), "the GC did not wait for the call");
    // The GC ran while `hold` was still live (before `release`): it kept it.
    let (_, after) = last_low_memory(&isolate);
    assert!(after > 30 * MB, "the live arrays were collected: heap physical {after}");
    assert_eq!(low_memory(&isolate), Reply::Done);
    let (_, released) = last_low_memory(&isolate);
    assert!(released + 30 * MB < after, "the released arrays were not freed: {after} -> {released}");
}
