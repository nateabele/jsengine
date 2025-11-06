use crate::conv::{anyhow_error_to_json, serde_v8_error_to_json};

use deno_ast::{EmitOptions, MediaType, ParseParams};
use deno_core::error::AnyError;
use deno_core::serde_json::Value;
use deno_core::{
    anyhow, op2, serde_v8, v8, Extension, FastString, FsModuleLoader, JsRuntime, ModuleCode,
    ModuleSpecifier, Op, RuntimeOptions,
};
use std::collections::HashMap;
use std::rc::Rc;

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

// Helper function to transpile TypeScript to JavaScript
fn transpile_typescript(code: &str, specifier: &str) -> Result<String, String> {
    // Determine media type from file extension only
    // Don't use heuristics on code content as they can match regular JavaScript
    let media_type = if specifier.ends_with(".ts") || specifier.ends_with(".tsx") {
        MediaType::TypeScript
    } else {
        MediaType::JavaScript
    };

    // If it's already JavaScript, return as-is
    if media_type == MediaType::JavaScript {
        return Ok(code.to_string());
    }

    // Parse and transpile TypeScript
    let parsed = deno_ast::parse_module(ParseParams {
        specifier: specifier.to_string(),
        text_info: deno_ast::SourceTextInfo::from_string(code.to_string()),
        media_type,
        capture_tokens: false,
        scope_analysis: false,
        maybe_syntax: None,
    })
    .map_err(|e| format!("Failed to parse TypeScript: {}", e))?;

    // Transpile to JavaScript
    let transpiled = parsed
        .transpile(&EmitOptions {
            inline_sources: false,
            ..Default::default()
        })
        .map_err(|e| format!("Failed to transpile TypeScript: {}", e))?;

    Ok(transpiled.text)
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
        let mut new_engine = Engine {
            runtime: JsRuntime::new(RuntimeOptions {
                module_loader: Some(Rc::new(FsModuleLoader)),
                extensions: vec![Extension {
                    name: "core:apis",
                    ops: std::borrow::Cow::Borrowed(&[op_set_timeout::DECL]),
                    ..Default::default()
                }],
                ..Default::default()
            }),
        };
        // This should never fail as runtime.js is embedded at compile time
        if let Err(e) = new_engine
            .runtime
            .execute_script_static("[core:runtime]", include_str!("./runtime.js"))
        {
            panic!("Failed to initialize JavaScript runtime: {:?}", e);
        }

        new_engine
    }

    async fn run(&mut self, code: &str) -> JsResult {
        // Transpile TypeScript to JavaScript if needed
        let js_code = transpile_typescript(code, "[inline]").map_err(Value::String)?;

        let result = eval_raw(&mut self.runtime, &js_code).await.map(|val| {
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

#[op2(async)]
async fn op_set_timeout(#[serde] delay: u64) -> Result<(), AnyError> {
    tokio::time::sleep(std::time::Duration::from_millis(delay)).await;
    Ok(())
}
