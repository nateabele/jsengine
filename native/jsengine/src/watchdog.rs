//! One process-wide thread that enforces call deadlines.
//!
//! An isolate thread arms an entry before it runs JavaScript and disarms it
//! when the request finishes, so the queue only holds requests in flight.
//! When a deadline passes and the same call is still running, the watchdog
//! marks the isolate timed out and calls `terminate_execution` on it. This is
//! the only way to stop JavaScript that never yields (`while(true){}`).

use crate::isolate::Shared;
use once_cell::sync::Lazy;
use std::collections::BTreeMap;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::sync::{Arc, Condvar, Mutex};
use std::time::Instant;

/// Deadlines in order; `seq` is unique per call, so keys never collide.
type Queue = BTreeMap<(Instant, u64), Arc<Shared>>;

struct Watchdog {
    queue: Mutex<Queue>,
    wake: Condvar,
}

static WATCHDOG: Lazy<&'static Watchdog> = Lazy::new(|| {
    let watchdog: &'static Watchdog = Box::leak(Box::new(Watchdog {
        queue: Mutex::new(BTreeMap::new()),
        wake: Condvar::new(),
    }));
    std::thread::Builder::new()
        .name("jsengine-watchdog".into())
        .spawn(move || run(watchdog))
        .expect("cannot spawn the jsengine watchdog thread");
    watchdog
});

fn queue(watchdog: &Watchdog) -> std::sync::MutexGuard<'_, Queue> {
    watchdog
        .queue
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner())
}

/// Arms a deadline for call `seq` of the isolate behind `shared`.
pub(crate) fn arm(deadline: Instant, shared: Arc<Shared>, seq: u64) {
    let watchdog = *WATCHDOG;
    queue(watchdog).insert((deadline, seq), shared);
    watchdog.wake.notify_one();
}

/// Removes the entry of a call that finished before its deadline.
pub(crate) fn disarm(deadline: Instant, seq: u64) {
    queue(*WATCHDOG).remove(&(deadline, seq));
}

#[cfg(test)]
pub(crate) fn pending() -> usize {
    queue(*WATCHDOG).len()
}

fn run(watchdog: &'static Watchdog) {
    let mut queue = queue(watchdog);
    loop {
        let now = Instant::now();
        while let Some(entry) = queue.first_entry() {
            if entry.key().0 > now {
                break;
            }
            let ((_, seq), shared) = entry.remove_entry();
            // A panic here would end the watchdog thread and every deadline
            // with it; expire() cannot panic, but never bet the thread on it.
            let _ = catch_unwind(AssertUnwindSafe(|| shared.expire(seq)));
        }
        queue = match queue.first_key_value().map(|((deadline, _), _)| *deadline) {
            Some(deadline) => {
                let wait = deadline.saturating_duration_since(Instant::now());
                watchdog
                    .wake
                    .wait_timeout(queue, wait)
                    .map(|(guard, _)| guard)
                    .unwrap_or_else(|poisoned| poisoned.into_inner().0)
            }
            None => watchdog
                .wake
                .wait(queue)
                .unwrap_or_else(|poisoned| poisoned.into_inner()),
        };
    }
}
