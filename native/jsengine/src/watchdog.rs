//! One process-wide thread that enforces call deadlines.
//!
//! An isolate thread arms an entry before it runs JavaScript. When the
//! deadline passes and the same call is still running, the watchdog marks
//! the isolate timed out and calls `terminate_execution` on it. This is the
//! only way to stop JavaScript that never yields (`while(true){}`).

use crate::isolate::Shared;
use once_cell::sync::Lazy;
use std::cmp::Ordering;
use std::collections::BinaryHeap;
use std::sync::{Arc, Condvar, Mutex};
use std::time::Instant;

struct Entry {
    deadline: Instant,
    seq: u64,
    shared: Arc<Shared>,
}

impl PartialEq for Entry {
    fn eq(&self, other: &Self) -> bool {
        self.deadline == other.deadline && self.seq == other.seq
    }
}

impl Eq for Entry {}

impl PartialOrd for Entry {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for Entry {
    // Reversed, so that BinaryHeap (a max-heap) pops the earliest deadline.
    fn cmp(&self, other: &Self) -> Ordering {
        other
            .deadline
            .cmp(&self.deadline)
            .then_with(|| other.seq.cmp(&self.seq))
    }
}

struct Watchdog {
    queue: Mutex<BinaryHeap<Entry>>,
    wake: Condvar,
}

static WATCHDOG: Lazy<&'static Watchdog> = Lazy::new(|| {
    let watchdog: &'static Watchdog = Box::leak(Box::new(Watchdog {
        queue: Mutex::new(BinaryHeap::new()),
        wake: Condvar::new(),
    }));
    std::thread::Builder::new()
        .name("jsengine-watchdog".into())
        .spawn(move || run(watchdog))
        .expect("cannot spawn the jsengine watchdog thread");
    watchdog
});

/// Arms a deadline for call `seq` of the isolate behind `shared`.
pub(crate) fn arm(deadline: Instant, shared: Arc<Shared>, seq: u64) {
    let watchdog = *WATCHDOG;
    let mut queue = watchdog
        .queue
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    queue.push(Entry {
        deadline,
        seq,
        shared,
    });
    watchdog.wake.notify_one();
}

fn run(watchdog: &'static Watchdog) {
    let mut queue = watchdog
        .queue
        .lock()
        .unwrap_or_else(|poisoned| poisoned.into_inner());
    loop {
        let now = Instant::now();
        while queue.peek().map_or(false, |top| top.deadline <= now) {
            if let Some(entry) = queue.pop() {
                entry.shared.expire(entry.seq);
            }
        }
        queue = match queue.peek().map(|top| top.deadline) {
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
