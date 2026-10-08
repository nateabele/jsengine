//! Tests of startup snapshots (D54): `cargo test`.

use super::*;
use crate::isolate::tests::{call, load};
use crate::isolate::{Isolate, Reply};
use std::time::Instant;

const TIMEOUT: Duration = Duration::from_secs(10);
const HEAP_MB: usize = 64;

/// A bundle with top-level state: a table built at load, a load counter and a
/// mutable global.
const BUNDLE: &str = r#"
var table = []; for (var i = 0; i < 1000; i++) table.push(i * i);
var loads = (globalThis.loads || 0) + 1; globalThis.loads = loads;
var counter = 0;
globalThis.sum = () => table.reduce((a, b) => a + b, 0);
globalThis.bump = () => ++counter;
globalThis.state = () => ({ loads, counter, stray: globalThis.stray ?? null });
globalThis.taint = (v) => { globalThis.stray = v; return v; };
globalThis.rand = () => Math.random();
globalThis.later = (v) => new Promise((r) => setTimeout(() => r(v), 5));
"#;

fn snapshot_of(code: &str) -> Arc<StartupSnapshot> {
    Arc::new(create("bundle.js", code.to_string(), TIMEOUT, HEAP_MB).expect("snapshot"))
}

#[test]
fn an_isolate_from_a_snapshot_answers_like_one_that_loaded_the_bundle() {
    let snapshot = snapshot_of(BUNDLE);
    let loaded = Isolate::spawn(64).expect("spawn");
    assert_eq!(load(&loaded, BUNDLE), Reply::Loaded);
    let started = Isolate::spawn_from(64, Some(snapshot)).expect("spawn from snapshot");
    for (fun, args) in [
        ("sum", "[]"),
        ("bump", "[]"),
        ("bump", "[]"),
        ("state", "[]"),
        ("later", "[7]"),
    ] {
        assert_eq!(
            call(&started, fun, args, TIMEOUT),
            call(&loaded, fun, args, TIMEOUT),
            "{fun}"
        );
    }
    // The bundle ran once, when the snapshot was made.
    assert_eq!(
        call(&started, "state", "[]", TIMEOUT),
        Reply::Value(r#"{"loads":1,"counter":2,"stray":null}"#.into())
    );
}

#[test]
fn a_snapshot_round_trips_through_bytes() {
    let snapshot = snapshot_of(BUNDLE);
    let bytes = snapshot.to_bytes();
    let back = Arc::new(StartupSnapshot::from_bytes(&bytes).expect("from_bytes"));
    assert_eq!(back.bundle_sha256(), bundle_sha256(BUNDLE));
    assert_eq!(back.size(), snapshot.size());
    let isolate = Isolate::spawn_from(64, Some(back)).expect("spawn");
    assert_eq!(
        call(&isolate, "sum", "[]", TIMEOUT),
        Reply::Value("332833500".into())
    );
}

#[test]
fn stored_bytes_of_another_build_or_damaged_bytes_are_refused() {
    let snapshot = snapshot_of(BUNDLE);
    let bytes = snapshot.to_bytes();

    // Another build id (same length, one byte changed).
    let mut other_build = bytes.clone();
    other_build[12] ^= 1;
    assert_eq!(
        StartupSnapshot::from_bytes(&other_build).err(),
        Some(Refused::Stale)
    );

    // A flipped payload byte, a truncated file, trailing garbage, not a snapshot.
    let mut flipped = bytes.clone();
    let last = flipped.len() - 1;
    flipped[last] ^= 1;
    assert_eq!(
        StartupSnapshot::from_bytes(&flipped).err(),
        Some(Refused::Corrupt)
    );
    assert_eq!(
        StartupSnapshot::from_bytes(&bytes[..bytes.len() - 1]).err(),
        Some(Refused::Corrupt)
    );
    let mut longer = bytes.clone();
    longer.push(0);
    assert_eq!(
        StartupSnapshot::from_bytes(&longer).err(),
        Some(Refused::Corrupt)
    );
    assert_eq!(
        StartupSnapshot::from_bytes(b"not a snapshot").err(),
        Some(Refused::Corrupt)
    );
}

#[test]
fn a_changed_bundle_has_another_key() {
    let a = snapshot_of(BUNDLE);
    let changed = format!("{BUNDLE}\nglobalThis.extra = () => 'new';");
    let b = snapshot_of(&changed);
    assert_ne!(a.bundle_sha256(), b.bundle_sha256());
    assert_eq!(b.bundle_sha256(), bundle_sha256(&changed));
    let old = Isolate::spawn_from(64, Some(a)).expect("spawn a");
    let new = Isolate::spawn_from(64, Some(b)).expect("spawn b");
    assert!(matches!(
        call(&old, "extra", "[]", TIMEOUT),
        Reply::Failed(Failure::Js(_))
    ));
    assert_eq!(
        call(&new, "extra", "[]", TIMEOUT),
        Reply::Value("\"new\"".into())
    );
}

#[test]
fn isolates_started_from_one_snapshot_share_no_state_or_random_sequence() {
    let snapshot = snapshot_of(BUNDLE);
    let a = Isolate::spawn_from(64, Some(snapshot.clone())).expect("spawn a");
    assert_eq!(call(&a, "bump", "[]", TIMEOUT), Reply::Value("1".into()));
    assert_eq!(call(&a, "bump", "[]", TIMEOUT), Reply::Value("2".into()));
    assert_eq!(
        call(&a, "taint", "[\"from a\"]", TIMEOUT),
        Reply::Value("\"from a\"".into())
    );
    // Started after `a` changed its heap: sees the snapshot, not `a`.
    let b = Isolate::spawn_from(64, Some(snapshot.clone())).expect("spawn b");
    assert_eq!(
        call(&b, "state", "[]", TIMEOUT),
        Reply::Value(r#"{"loads":1,"counter":0,"stray":null}"#.into())
    );
    assert_eq!(call(&b, "bump", "[]", TIMEOUT), Reply::Value("1".into()));
    assert_eq!(
        call(&a, "state", "[]", TIMEOUT),
        Reply::Value(r#"{"loads":1,"counter":2,"stray":"from a"}"#.into())
    );
    // Each isolate draws its own Math.random sequence (V8 resets the cache at
    // serialisation). This does not guard the predictable-mode trap: another
    // test may have initialised V8 first. The fresh-process Elixir test does.
    let ra = call(&a, "rand", "[]", TIMEOUT);
    let rb = call(&b, "rand", "[]", TIMEOUT);
    let rc = call(
        &Isolate::spawn_from(64, Some(snapshot)).expect("spawn c"),
        "rand",
        "[]",
        TIMEOUT,
    );
    assert!(
        ra != rb || rb != rc,
        "same Math.random in every isolate: {ra:?} {rb:?} {rc:?}"
    );
}

#[test]
fn an_isolate_keeps_working_after_the_caller_drops_its_snapshot() {
    // Shows the isolate thread holds its own reference. V8 does not read the
    // blob after start, so this cannot show the blob's lifetime is right;
    // that rests on the drop order in `isolate_thread`.
    let snapshot = snapshot_of(BUNDLE);
    let isolate = Isolate::spawn_from(64, Some(snapshot)).expect("spawn");
    load(&isolate, "globalThis.churn = () => { let a = []; for (let i = 0; i < 200000; i++) a.push({ i }); return a.length; };");
    assert_eq!(
        call(&isolate, "churn", "[]", TIMEOUT),
        Reply::Value("200000".into())
    );
    assert_eq!(
        call(&isolate, "sum", "[]", TIMEOUT),
        Reply::Value("332833500".into())
    );
}

#[test]
fn a_heap_too_small_for_the_snapshot_is_refused_before_v8_reads_it() {
    let big = "globalThis.big = Array.from({ length: 2000000 }, (_, i) => i); globalThis.len = () => big.length;";
    let snapshot = snapshot_of(big);
    assert!(
        snapshot.size() * 4 > 16 * 1024 * 1024,
        "{}",
        snapshot.size()
    );
    assert!(matches!(
        Isolate::spawn_from(16, Some(snapshot.clone())),
        Err(Failure::Oom)
    ));
    let roomy = Isolate::spawn_from(256, Some(snapshot)).expect("spawn");
    assert_eq!(
        call(&roomy, "len", "[]", TIMEOUT),
        Reply::Value("2000000".into())
    );
}

#[test]
fn many_isolates_start_from_one_snapshot_at_once() {
    let snapshot = snapshot_of(BUNDLE);
    let threads: Vec<_> = (0..16)
        .map(|k| {
            let snapshot = snapshot.clone();
            std::thread::spawn(move || {
                let isolate = Isolate::spawn_from(64, Some(snapshot)).expect("spawn");
                for _ in 0..=k {
                    call(&isolate, "bump", "[]", TIMEOUT);
                }
                call(&isolate, "state", "[]", TIMEOUT)
            })
        })
        .collect();
    for (k, thread) in threads.into_iter().enumerate() {
        let expected = format!(r#"{{"loads":1,"counter":{},"stray":null}}"#, k + 1);
        assert_eq!(thread.join().unwrap(), Reply::Value(expected));
    }
}

#[test]
fn a_snapshot_isolate_keeps_the_heap_limit_and_the_deadline() {
    let snapshot = snapshot_of("globalThis.hog = () => { const a = []; for (;;) a.push(new Array(100000).fill(1.5)); }; globalThis.spin = () => { for (;;) {} };");
    let a = Isolate::spawn_from(64, Some(snapshot.clone())).expect("spawn");
    assert_eq!(
        call(&a, "hog", "[]", Duration::from_secs(30)),
        Reply::Failed(Failure::Oom)
    );
    let b = Isolate::spawn_from(64, Some(snapshot)).expect("spawn");
    assert_eq!(
        call(&b, "spin", "[]", Duration::from_millis(200)),
        Reply::Failed(Failure::Timeout)
    );
}

#[test]
fn a_bundle_that_throws_or_leaves_async_work_is_refused() {
    match create(
        "bad.js",
        "throw new Error('at load');".into(),
        TIMEOUT,
        HEAP_MB,
    ) {
        Err(Failure::Js(message)) => assert!(message.contains("at load"), "{message}"),
        other => panic!("expected a JS failure, got {:?}", other.map(|s| s.size())),
    }
    match create(
        "timer.js",
        "setTimeout(() => {}, 0);".into(),
        TIMEOUT,
        HEAP_MB,
    ) {
        Err(Failure::Js(message)) => assert!(message.contains("pending"), "{message}"),
        other => panic!("expected a JS failure, got {:?}", other.map(|s| s.size())),
    }
}

#[test]
fn a_spinning_bundle_times_out() {
    let started = Instant::now();
    match create(
        "spin.js",
        "for (;;) {}".into(),
        Duration::from_millis(200),
        HEAP_MB,
    ) {
        Err(Failure::Timeout) => {}
        other => panic!("expected a timeout, got {:?}", other.map(|s| s.size())),
    }
    assert!(started.elapsed() < Duration::from_secs(5));
}

#[test]
fn a_bundle_that_allocates_without_bound_at_load_is_oom_not_an_abort() {
    let started = Instant::now();
    let hog = "const hoard = []; for (;;) hoard.push(new Array(100000).fill(1.5));";
    match create("hog.js", hog.into(), Duration::from_secs(60), HEAP_MB) {
        Err(Failure::Oom) => {}
        other => panic!("expected an OOM, got {:?}", other.map(|s| s.size())),
    }
    assert!(
        started.elapsed() < Duration::from_secs(30),
        "{:?}",
        started.elapsed()
    );
    // The process is fine, and so is the next snapshot.
    let snapshot = snapshot_of(BUNDLE);
    let isolate = Isolate::spawn_from(64, Some(snapshot)).expect("spawn");
    assert_eq!(
        call(&isolate, "sum", "[]", TIMEOUT),
        Reply::Value("332833500".into())
    );
}

#[test]
fn an_asm_js_module_at_load_is_plain_javascript_and_snapshots() {
    // V8 cannot serialise validated asm.js; deno_core's --no-validate-asm
    // means it is never validated.
    let code = r#"
        function Mod(stdlib) { "use asm"; function f(x) { x = x | 0; return (x + 1) | 0; } return { f: f }; }
        var m = Mod(globalThis);
        globalThis.inc = (x) => m.f(x);
    "#;
    let snapshot = snapshot_of(code);
    let isolate = Isolate::spawn_from(64, Some(snapshot)).expect("spawn");
    assert_eq!(
        call(&isolate, "inc", "[41]", TIMEOUT),
        Reply::Value("42".into())
    );
}

// ---------------------------------------------------------------------------
// The real interop bundle: equivalence and measurements. Ignored by default;
//   JSENGINE_D54_BUNDLE=/path/server-interop.min.js \
//     cargo test --release -- --ignored --nocapture --test-threads=1 real_bundle
// ---------------------------------------------------------------------------

fn process_cpu() -> Duration {
    // SAFETY: getrusage fills the struct it is given.
    let usage = unsafe {
        let mut usage = std::mem::zeroed::<libc::rusage>();
        libc::getrusage(libc::RUSAGE_SELF, &mut usage);
        usage
    };
    let tv = |t: libc::timeval| Duration::new(t.tv_sec as u64, t.tv_usec as u32 * 1000);
    tv(usage.ru_utime) + tv(usage.ru_stime)
}

fn loadavg() -> String {
    std::process::Command::new("sysctl")
        .args(["-n", "vm.loadavg"])
        .output()
        .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
        .unwrap_or_default()
}

fn median(mut v: Vec<Duration>) -> f64 {
    v.sort();
    v[v.len() / 2].as_secs_f64() * 1000.0
}

const WS_INIT: &str = r#"["d54-ws",{"workspace":{"wire":1,"id":"d54-ws","title":"T","owner":"u1","items":["rec1"],"streams":[],"builtins":{"signatures":{},"decls":{}},"names":{},"order":{}},"objects":[{"wire":1,"workspace":"d54-ws","id":"rec1","meta":{},"coords":{"pos":{"x":0,"y":0},"size":{"width":10,"height":10}},"def":{"kind":"data","title":"R","type":{"kind":"record","fields":{"name":{"kind":"text"},"note":{"kind":"text"}}},"val":{"name":"a","note":"one"},"source":{"kind":"local"},"state":"green","names":{"name":"Name","note":"Note"}}}]}]"#;
const WS_PATCH: &str = r#"["d54-ws",{"kind":"update","ref":{"object":"rec1","path":{"steps":[{"key":"name"}],"end":{"kind":"val","value":{"kind":"text","value":"b"}}}}},{"user":"u1","role":"owner"},{"now":1000000}]"#;

/// The calls a workspace makes after its isolate starts: version, init, a patch, a read.
fn workspace_calls(isolate: &Isolate) -> Vec<Reply> {
    vec![
        call(isolate, "version", "[]", TIMEOUT),
        call(isolate, "init", WS_INIT, TIMEOUT),
        call(isolate, "patch", WS_PATCH, TIMEOUT),
        call(isolate, "get", r#"["d54-ws",{"now":1000000}]"#, TIMEOUT),
        call(isolate, "patch", WS_PATCH, TIMEOUT),
    ]
}

#[test]
#[ignore]
fn real_bundle_equivalence_and_timings() {
    let Ok(path) = std::env::var("JSENGINE_D54_BUNDLE") else {
        eprintln!("JSENGINE_D54_BUNDLE not set; skipped");
        return;
    };
    let code = std::fs::read_to_string(&path).expect("bundle");
    let n: usize = std::env::var("JSENGINE_D54_N")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(15);

    // Warm-up: V8 platform, page cache.
    let warm = Isolate::spawn(256).unwrap();
    assert_eq!(load(&warm, &code), Reply::Loaded);
    drop(warm);

    // Snapshot creation.
    let (c0, w0) = (process_cpu(), Instant::now());
    let snapshot = Arc::new(
        create(
            "server-interop.min.js",
            code.clone(),
            Duration::from_secs(30),
            256,
        )
        .expect("snapshot"),
    );
    let (create_wall, create_cpu) = (w0.elapsed(), process_cpu() - c0);
    let bytes = snapshot.to_bytes();
    let (w0, c0) = (Instant::now(), process_cpu());
    let _ = StartupSnapshot::from_bytes(&bytes).unwrap();
    let from_bytes_wall = w0.elapsed();
    let _ = c0;
    println!(
        "[d54] snapshot {} B (stored {} B), create wall {:.1} ms CPU {:.1} ms, from_bytes {:.1} ms  [loadavg {}]",
        snapshot.size(), bytes.len(), create_wall.as_secs_f64() * 1e3, create_cpu.as_secs_f64() * 1e3,
        from_bytes_wall.as_secs_f64() * 1e3, loadavg()
    );

    // Equivalence: the same calls give the same replies both ways.
    let loaded = Isolate::spawn(256).unwrap();
    assert_eq!(load(&loaded, &code), Reply::Loaded);
    let started = Isolate::spawn_from(256, Some(snapshot.clone())).unwrap();
    let expected = workspace_calls(&loaded);
    assert!(
        expected.iter().all(|r| matches!(r, Reply::Value(_))),
        "{expected:?}"
    );
    assert_eq!(workspace_calls(&started), expected);
    println!(
        "[d54] equivalence: {} calls identical (version, init, patch, get, patch)",
        expected.len()
    );

    for mode in ["baseline", "snapshot"] {
        let start = || -> Isolate {
            if mode == "baseline" {
                let i = Isolate::spawn(256).unwrap();
                assert_eq!(load(&i, &code), Reply::Loaded);
                i
            } else {
                Isolate::spawn_from(256, Some(snapshot.clone())).unwrap()
            }
        };
        let (mut cpu, mut wall, mut tfa_cpu, mut tfa_wall) = (vec![], vec![], vec![], vec![]);
        let mut steps: Vec<[Duration; 4]> = vec![];
        for _ in 0..n {
            let (c0, w0) = (process_cpu(), Instant::now());
            let i = start();
            assert!(matches!(
                call(&i, "version", "[]", TIMEOUT),
                Reply::Value(_)
            ));
            wall.push(w0.elapsed());
            cpu.push(process_cpu() - c0);
            i.shutdown(Some(Duration::from_secs(2)));
        }
        for _ in 0..n {
            let (c0, w0) = (process_cpu(), Instant::now());
            let i = start();
            let t0 = Instant::now();
            assert!(matches!(
                call(&i, "version", "[]", TIMEOUT),
                Reply::Value(_)
            ));
            let t1 = Instant::now();
            assert_eq!(
                call(&i, "init", WS_INIT, TIMEOUT),
                Reply::Value("true".into())
            );
            let t2 = Instant::now();
            assert!(matches!(
                call(&i, "patch", WS_PATCH, TIMEOUT),
                Reply::Value(_)
            ));
            let t3 = Instant::now();
            steps.push([t0 - w0, t1 - t0, t2 - t1, t3 - t2]);
            tfa_wall.push(w0.elapsed());
            tfa_cpu.push(process_cpu() - c0);
            i.shutdown(Some(Duration::from_secs(2)));
        }
        println!(
            "[d54] {mode}: start+version CPU median {:.1} ms, wall median {:.1} ms; first apply CPU median {:.1} ms, wall median {:.1} ms  [n={n}, loadavg {}]",
            median(cpu), median(wall), median(tfa_cpu), median(tfa_wall), loadavg()
        );
        let step = |k: usize| median(steps.iter().map(|s| s[k]).collect());
        println!(
            "[d54] {mode}: first apply wall by step (medians): start {:.1} ms, version {:.1} ms, init {:.1} ms, patch {:.1} ms",
            step(0), step(1), step(2), step(3)
        );
    }
}

#[test]
#[ignore]
fn real_bundle_heap_after_start() {
    let Ok(path) = std::env::var("JSENGINE_D54_BUNDLE") else {
        eprintln!("JSENGINE_D54_BUNDLE not set; skipped");
        return;
    };
    let code = std::fs::read_to_string(&path).expect("bundle");
    let snapshot = create(
        "server-interop.min.js",
        code.clone(),
        Duration::from_secs(30),
        256,
    )
    .expect("snapshot");
    let _platform = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap();
    let _enter = _platform.enter();
    let heap = |runtime: &mut JsRuntime| {
        let mut stats = v8::HeapStatistics::default();
        runtime.v8_isolate().get_heap_statistics(&mut stats);
        (
            stats.used_heap_size() / 1024,
            stats.total_heap_size() / 1024,
            stats.malloced_memory() / 1024,
        )
    };
    let mut loaded = crate::engine::new_runtime(None, None).unwrap();
    loaded
        .execute_script("server-interop.min.js", FastString::from(code))
        .unwrap();
    // SAFETY: `snapshot` outlives `started` (declared before it).
    let mut started =
        crate::engine::new_runtime(None, Some(unsafe { snapshot.startup_data() })).unwrap();
    println!(
        "[d54] heap KB (used, total, malloced): loaded {:?}, from snapshot {:?}",
        heap(&mut loaded),
        heap(&mut started)
    );
}

#[test]
fn a_bundle_that_churns_young_garbage_at_load_snapshots_at_the_smallest_heap() {
    // About 160 MB allocated at load, almost all of it dead at once: the heap
    // guard must not count the dead young objects against `heap_mb` (16 MiB,
    // the smallest), as it did not before the young generation grew.
    let code = "var total = 0; for (var i = 0; i < 20000; i++) { var a = new Array(1000).fill(i); total += a.length; } globalThis.kept = () => total;";
    let snapshot = create("churn.js", code.to_string(), TIMEOUT, 16).expect("snapshot at heap_mb 16");
    let isolate = Isolate::spawn_from(64, Some(Arc::new(snapshot))).expect("spawn");
    assert_eq!(call(&isolate, "kept", "[]", TIMEOUT), Reply::Value("20000000".into()));
}

#[test]
fn timers_work_in_an_isolate_from_a_snapshot() {
    let code = format!("{}\nglobalThis.nextId = () => setTimeout(() => {{}}, 0);", crate::isolate::tests::TIMER_PROBES);
    let snapshot = snapshot_of(&code);
    let started = Isolate::spawn_from(64, Some(snapshot.clone())).expect("spawn from snapshot");
    crate::isolate::tests::assert_timer_probes(&started);
    // A fresh isolate from the snapshot numbers its timers like one that
    // loaded the bundle.
    let loaded = Isolate::spawn(64).expect("spawn");
    assert_eq!(load(&loaded, &code), Reply::Loaded);
    let fresh = Isolate::spawn_from(64, Some(snapshot.clone())).expect("spawn from snapshot");
    assert_eq!(call(&fresh, "nextId", "[]", TIMEOUT), call(&loaded, "nextId", "[]", TIMEOUT));
    crate::isolate::tests::assert_cleared_closures_are_released(Some(&snapshot));
    crate::isolate::tests::assert_a_thrown_handler_is_released(Some(&snapshot));
}

#[test]
fn a_timer_cleared_at_load_snapshots_and_a_live_one_is_refused() {
    // Armed and cleared at load: the cancelled sleep is drained, the bundle
    // snapshots, and the restored isolate numbers timers like a loaded one.
    let cleared = "globalThis.fired = false; clearTimeout(setTimeout(() => { globalThis.fired = true; }, 60000)); clearTimeout(setTimeout(() => {}, 0)); globalThis.nextId = () => setTimeout(() => {}, 0); globalThis.check = () => new Promise((r) => setTimeout(() => r(fired), 20));";
    let snapshot = snapshot_of(cleared);
    let started = Isolate::spawn_from(64, Some(snapshot)).expect("spawn from snapshot");
    let loaded = Isolate::spawn(64).expect("spawn");
    assert_eq!(load(&loaded, cleared), Reply::Loaded);
    assert_eq!(call(&started, "nextId", "[]", TIMEOUT), Reply::Value("3".into()));
    assert_eq!(call(&loaded, "nextId", "[]", TIMEOUT), Reply::Value("3".into()));
    assert_eq!(call(&started, "check", "[]", TIMEOUT), Reply::Value("false".into()));
    // A live timer at load is still refused, with or without cleared ones.
    for live in [
        "setTimeout(() => {}, 0);",
        "setTimeout(() => {}, 60000);",
        "clearTimeout(setTimeout(() => {}, 60000)); setTimeout(() => {}, 60000);",
        "const live = setTimeout(() => {}, 0); clearTimeout(setTimeout(() => {}, 60000));",
        "for (let i = 0; i < 100; i++) clearTimeout(setTimeout(() => {}, 1)); setTimeout(() => {}, 1);",
    ] {
        match create("live.js", live.into(), TIMEOUT, HEAP_MB) {
            Err(Failure::Js(message)) => assert!(message.contains("pending"), "{live}: {message}"),
            other => panic!("{live}: expected a refusal, got {:?}", other.map(|s| s.size())),
        }
    }
}

#[test]
fn a_low_memory_notification_frees_a_worked_isolate_started_from_a_snapshot() {
    let isolate = Isolate::spawn_from(256, Some(snapshot_of(BUNDLE))).expect("spawn from snapshot");
    crate::isolate::tests::assert_low_memory_frees_a_worked_isolate(&isolate);
    // The snapshot's state survives the GC.
    assert_eq!(call(&isolate, "sum", "[]", TIMEOUT), Reply::Value("332833500".into()));
}
