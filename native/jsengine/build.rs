//! Stamps the NIF with a build id (D54). A stored V8 startup snapshot is only
//! valid for the binary that made it (same V8, same ops, same `runtime.js`),
//! so `snapshot::StartupSnapshot::from_bytes` refuses one with another id.
//! The script has no `rerun-if-changed` lines, so cargo reruns it whenever a
//! file of the package changes: every rebuild of jsengine gets a new id.

use std::time::{SystemTime, UNIX_EPOCH};

fn main() {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    let profile = std::env::var("PROFILE").unwrap_or_default();
    let features: Vec<String> = std::env::vars()
        .filter_map(|(k, _)| k.strip_prefix("CARGO_FEATURE_").map(str::to_lowercase))
        .collect();
    println!(
        "cargo:rustc-env=JSENGINE_BUILD_ID={}-{}-{}-{:x}",
        std::env::var("CARGO_PKG_VERSION").unwrap_or_default(),
        profile,
        features.join("+"),
        nanos
    );
}
