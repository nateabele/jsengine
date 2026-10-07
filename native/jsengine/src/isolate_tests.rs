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
}
