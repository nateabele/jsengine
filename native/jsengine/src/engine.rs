use crate::conv::{anyhow_error_to_json, serde_v8_error_to_json};

use deno_ast::{EmitOptions, MediaType, ParseParams};
use deno_core::error::AnyError;
use deno_core::serde_json::Value;
use deno_core::{
    anyhow, op2, serde_v8, v8, CancelFuture, CancelHandle, Extension, FastString, FsModuleLoader,
    JsRuntime, ModuleCode, ModuleSpecifier, Op, OpState, ResourceId, RuntimeOptions, Snapshot,
};
use crate::isolate::panic_message;
use deno_core::futures::FutureExt;
use std::cell::RefCell;
use std::collections::HashMap;
use std::panic::AssertUnwindSafe;
use std::rc::Rc;
use std::sync::Once;

pub(crate) type JsResult = Result<Value, Value>;
pub(crate) type EnvId = u64;

pub enum Request {
    CreateEnv,
    DestroyEnv(EnvId),
    Load(EnvId, Vec<String>),
    Run(EnvId, String),
    Call(EnvId, String, Vec<Value>),
}

pub enum Response {
    EnvCreated(EnvId),
    EnvDestroyed,
    Result(JsResult),
}

// Transpiles a TypeScript file to JavaScript. Only `load` calls this, and
// only for paths ending in `.ts` or `.tsx`: the content is never inspected
// to guess the language.
fn transpile_typescript(code: &str, specifier: &str) -> Result<String, String> {
    let parsed = deno_ast::parse_module(ParseParams {
        specifier: specifier.to_string(),
        text_info: deno_ast::SourceTextInfo::from_string(code.to_string()),
        media_type: MediaType::TypeScript,
        capture_tokens: false,
        scope_analysis: false,
        maybe_syntax: None,
    })
    .map_err(|e| format!("Failed to parse TypeScript: {}", e))?;

    let transpiled = parsed
        .transpile(&EmitOptions {
            inline_sources: false,
            ..Default::default()
        })
        .map_err(|e| format!("Failed to transpile TypeScript: {}", e))?;

    Ok(transpiled.text)
}

/// The jsengine host extension (the ops behind `setTimeout` and
/// `clearTimeout`). A startup
/// snapshot and every runtime started from it must register exactly this
/// list, in this order: V8 resolves the op functions a snapshot refers to by
/// their index among the external references (D54).
pub(crate) fn host_extensions() -> Vec<Extension> {
    vec![Extension {
        name: "core:apis",
        ops: std::borrow::Cow::Borrowed(&[op_set_timeout::DECL, op_timer_handle::DECL]),
        ..Default::default()
    }]
}

/// Installs the host APIs (console, setTimeout, clearTimeout) in a fresh context. A runtime
/// started from a snapshot already has them.
pub(crate) fn bootstrap(runtime: &mut JsRuntime) -> Result<(), anyhow::Error> {
    runtime.execute_script_static("[core:runtime]", include_str!("./runtime.js"))?;
    Ok(())
}

/// The largest semi-space, in MiB, of every isolate of this process. V8's
/// young generation is two semi-spaces plus a new large-object space of the
/// same size, so up to 3 x this.
///
/// Without it V8 derives the young generation from the `heap_limits` cap:
/// at the 256 MiB default that is a 1 MiB semi-space, and the minor GCs
/// dominate a long replay (aravis cold start: see unitB-report.md). rusty_v8
/// 0.81 has no per-isolate setter for the young generation (the
/// `ResourceConstraints` fields are private), so it is a process-wide V8
/// flag. The flag wins over the size derived from `heap_limits` and leaves
/// the old generation as `heap_limits` sized it. So `heap_mb` caps the old
/// generation only: the `:oom` budget does not shrink, and the young
/// generation comes on top, up to 3 x 8 = 24 MiB per isolate.
///
/// The memory is resident, not only reserved: V8 keeps a grown semi-space
/// for the life of the isolate, because jsengine never runs V8's idle tasks
/// (the memory reducer). Measured on the aravis cold-start replay
/// (unitB-report.md, bake-off): a fresh isolate costs nothing more; after
/// the replay an isolate keeps about +5.5 MB, idle or not, until a full GC
/// such as a low-memory notification. The replay is about 27% faster than
/// at 1 MiB. 16 MiB was faster still (about 35%) but kept about +22 MB.
///
/// There is no `--min-semi-space-size`: the semi-space starts at V8's
/// smallest size and grows only in an isolate that needs it.
pub(crate) const SEMI_SPACE_MB: usize = 8;

/// jsengine's V8 flags: the young-generation size.
pub(crate) fn v8_flags() -> String {
    format!("--max-semi-space-size={SEMI_SPACE_MB}")
}

/// Sets jsengine's V8 flags, then initialises V8 (once per process). Every
/// path that makes a runtime calls this first, so the flags are set before
/// V8 starts (V8 freezes its flags at initialisation). A startup snapshot
/// is made and read under the same flags, in the same process.
pub(crate) fn init_v8() {
    static INIT: Once = Once::new();
    INIT.call_once(|| {
        v8::V8::set_flags_from_string(&v8_flags());
        JsRuntime::init_platform(None);
    });
}

/// Builds a JsRuntime with the jsengine host APIs (console, setTimeout,
/// clearTimeout).
/// `create_params` carries the heap limits of a hardened isolate; the legacy
/// engine passes `None`. With `snapshot`, the runtime starts from that V8
/// startup snapshot (D54) instead of a pristine context.
pub(crate) fn new_runtime(
    create_params: Option<v8::CreateParams>,
    snapshot: Option<Snapshot>,
) -> Result<JsRuntime, anyhow::Error> {
    init_v8();
    let from_snapshot = snapshot.is_some();
    let mut runtime = JsRuntime::new(RuntimeOptions {
        module_loader: Some(Rc::new(FsModuleLoader)),
        create_params,
        startup_snapshot: snapshot,
        extensions: host_extensions(),
        ..Default::default()
    });
    if !from_snapshot {
        bootstrap(&mut runtime)?;
    }
    Ok(runtime)
}

pub(crate) struct Engine {
    runtime: JsRuntime,
}

pub(crate) struct EngineManager {
    engines: HashMap<EnvId, Engine>,
    next_id: EnvId,
}

impl EngineManager {
    pub fn new() -> Self {
        let mut manager = EngineManager {
            engines: HashMap::new(),
            next_id: 1, // 0 is reserved for default environment
        };
        // Create default environment
        manager.engines.insert(0, Engine::new());
        manager
    }

    pub async fn handle(&mut self, req: &Request) -> Response {
        match req {
            Request::CreateEnv => {
                let id = self.next_id;
                self.next_id += 1;
                self.engines.insert(id, Engine::new());
                Response::EnvCreated(id)
            }
            Request::DestroyEnv(id) => {
                if *id == 0 {
                    Response::Result(Err(Value::String(
                        "Cannot destroy default environment".to_string(),
                    )))
                } else if self.engines.remove(id).is_some() {
                    Response::EnvDestroyed
                } else {
                    Response::Result(Err(Value::String(format!("Environment {} not found", id))))
                }
            }
            Request::Load(env_id, files) => {
                if let Some(engine) = self.engines.get_mut(env_id) {
                    Response::Result(engine.load(files).await)
                } else {
                    Response::Result(Err(Value::String(format!(
                        "Environment {} not found",
                        env_id
                    ))))
                }
            }
            Request::Run(env_id, code) => {
                if let Some(engine) = self.engines.get_mut(env_id) {
                    Response::Result(engine.run(code).await)
                } else {
                    Response::Result(Err(Value::String(format!(
                        "Environment {} not found",
                        env_id
                    ))))
                }
            }
            Request::Call(env_id, fn_name, args) => {
                if let Some(engine) = self.engines.get_mut(env_id) {
                    Response::Result(engine.call(fn_name, args).await)
                } else {
                    Response::Result(Err(Value::String(format!(
                        "Environment {} not found",
                        env_id
                    ))))
                }
            }
        }
    }
}

impl Engine {
    pub fn new() -> Self {
        match new_runtime(None, None) {
            Ok(runtime) => Engine { runtime },
            Err(e) => panic!("Failed to initialize JavaScript runtime: {:?}", e),
        }
    }

    async fn run(&mut self, code: &str) -> JsResult {
        let result = eval_raw(&mut self.runtime, code).await.map(|val| {
            let scope = &mut self.runtime.handle_scope();
            let local = v8::Local::new(scope, val);
            serde_v8::from_v8::<Value>(scope, local)
        });

        match result {
            Ok(Ok(value)) => Ok(value),
            Ok(Err(err)) => Err(serde_v8_error_to_json(&err)),
            Err(err) => Err(anyhow_error_to_json(&err)),
        }
    }

    async fn load(&mut self, js_files: &[String]) -> JsResult {
        for file_path in js_files {
            // Read the file contents
            let contents = std::fs::read_to_string(file_path).map_err(|e| {
                Value::String(format!("Failed to read file '{}': {}", file_path, e))
            })?;

            // Determine if this is TypeScript
            let is_typescript = file_path.ends_with(".ts") || file_path.ends_with(".tsx");

            // Transpile TypeScript if needed
            let js_code = if is_typescript {
                transpile_typescript(&contents, file_path).map_err(Value::String)?
            } else {
                contents.clone()
            };

            // Determine if this is an ES module (contains import/export statements)
            let is_module = js_code.contains("import ") || js_code.contains("export ");

            if is_module {
                // Handle as ES module
                let absolute_path = std::fs::canonicalize(file_path).map_err(|e| {
                    Value::String(format!("Failed to resolve path {}: {}", file_path, e))
                })?;

                let module_specifier =
                    ModuleSpecifier::from_file_path(&absolute_path).map_err(|_| {
                        Value::String(format!(
                            "Failed to create module specifier from path: {}",
                            absolute_path.display()
                        ))
                    })?;

                let module_code = ModuleCode::from(FastString::from(js_code));

                // Load the module
                let mod_id = self
                    .runtime
                    .load_main_module(&module_specifier, Some(module_code))
                    .await
                    .map_err(|e| Value::String(format!("Failed to load module: {}", e)))?;

                // Evaluate the module
                let result = self.runtime.mod_evaluate(mod_id);
                self.runtime
                    .run_event_loop(Default::default())
                    .await
                    .map_err(|e| Value::String(format!("Failed to evaluate module: {}", e)))?;

                // Wait for the module evaluation to complete
                let _ = result
                    .await
                    .map_err(|e| Value::String(format!("Module evaluation error: {}", e)))?;
            } else {
                // Handle as regular script (not a module)
                self.run(&js_code).await?;
            }
        }
        Ok(Value::Null)
    }

    async fn call(&mut self, fn_name: &str, args: &[Value]) -> JsResult {
        call_internal(&mut self.runtime, fn_name, args).await
    }
}

pub async fn call_internal(js_runtime: &mut JsRuntime, fn_name: &str, args: &[Value]) -> JsResult {
    let call_result = {
        let scope = &mut js_runtime.handle_scope();
        let context = scope.get_current_context();
        let global = context.global(scope);

        let fn_key = v8::String::new(scope, fn_name)
            .ok_or_else(|| Value::String(format!("Error creating V8 string from {}", fn_name)))?;
        let func = global
            .get(scope, fn_key.into())
            .ok_or_else(|| Value::String(format!("Function {} not found", fn_name)))?;
        let func = v8::Local::<v8::Function>::try_from(func)
            .map_err(|_| Value::String(format!("{} is not a callable function", fn_name)))?;

        let v8_args: Result<Vec<_>, _> = args
            .iter()
            .map(|arg| {
                serde_v8::to_v8(scope, arg)
                    .map_err(|_| Value::String("Error converting argument to V8 value".to_string()))
            })
            .collect();

        match v8_args {
            Ok(v8_args) => func
                .call(scope, global.into(), &v8_args)
                .map(|local| v8::Global::new(scope, local))
                .ok_or_else(|| Value::String(format!("Error calling function {}", fn_name))),
            Err(e) => Err(e),
        }
    };

    match call_result {
        Ok(result) => js_runtime
            .resolve_value(result)
            .await
            .map(|result| {
                let scope = &mut js_runtime.handle_scope();
                let local = v8::Local::new(scope, result);
                serde_v8::from_v8::<Value>(scope, local).map_err(|err| serde_v8_error_to_json(&err))
            })
            .map_err(|err| anyhow_error_to_json(&err))?,
        Err(err) => Err(err),
    }
}

async fn eval_raw(
    js_runtime: &mut JsRuntime,
    code: &str,
) -> Result<v8::Global<v8::Value>, anyhow::Error> {
    let module: ModuleCode = FastString::from(code.to_owned());
    let result = js_runtime.execute_script("[core]", module);

    match result {
        Ok(value) => js_runtime.resolve_value(value).await,
        Err(err) => Err(err),
    }
}

// deno_core may poll this future inside a V8 callback (an extern "C"
// frame), where an unwinding panic aborts the process. A panic (for example
// tokio::time::sleep with no runtime on the thread) becomes a rejected
// promise instead. Bad delays (negative, NaN, non-numbers) never get here:
// the #[serde] u64 conversion throws a TypeError in JavaScript, and tokio
// clamps huge delays to its far future.
//
// `rid` is the timer's CancelHandle (op_timer_handle). clearTimeout closes
// it, which cancels the sleep: the op then rejects (runtime.js ignores the
// rejection of a cleared timer) and deno_core drops its promise on the next
// poll, instead of holding it until the delay runs out.
#[op2(async)]
async fn op_set_timeout(
    state: Rc<RefCell<OpState>>,
    #[serde] delay: u64,
    #[smi] rid: ResourceId,
) -> Result<(), AnyError> {
    let cancel = state.borrow().resource_table.get::<CancelHandle>(rid)?;
    // The async block defers creating the timer into the guarded poll.
    AssertUnwindSafe(async move {
        tokio::time::sleep(std::time::Duration::from_millis(delay)).await
    })
    .catch_unwind()
    .or_cancel(cancel)
    .await
    .map_err(|canceled| anyhow::anyhow!(canceled))?
    .map_err(|payload| anyhow::anyhow!("setTimeout failed: {}", panic_message(&*payload)))
}

/// A new timer's cancel handle: a resource that clearTimeout (or the timer
/// firing) closes. Fresh per runtime; a snapshot holds none, because a
/// bundle with a pending timer at load is refused.
#[op2(fast)]
#[smi]
fn op_timer_handle(state: &mut OpState) -> ResourceId {
    state.resource_table.add(CancelHandle::new())
}
