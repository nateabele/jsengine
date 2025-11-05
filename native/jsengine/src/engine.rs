use crate::conv::{anyhow_error_to_json, serde_v8_error_to_json};

use deno_core::error::AnyError;
use deno_core::serde_json::Value;
use deno_core::{
    anyhow, op2, serde_v8, v8, Extension, FastString, JsRuntime, ModuleCode, Op, RuntimeOptions,
};
use tokio;

pub(crate) type JsResult = Result<Value, Value>;

pub enum Request {
    Load(Vec<String>),
    Run(String),
    Call(String, Vec<Value>),
}

pub(crate) struct Engine {
    runtime: JsRuntime,
}

impl Engine {
    pub fn new() -> Self {
        let mut new_engine = Engine {
            runtime: JsRuntime::new(RuntimeOptions {
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
            let contents = std::fs::read_to_string(file_path).map_err(|e| {
                Value::String(format!("Failed to read file '{}': {}", file_path, e))
            })?;

            // Execute the file contents and propagate any errors
            self.run(&contents).await?;
        }
        Ok(Value::Null)
    }

    async fn call(&mut self, fn_name: &str, args: &[Value]) -> JsResult {
        call_internal(&mut self.runtime, &fn_name, &args).await
    }

    pub async fn handle(&mut self, req: &Request) -> JsResult {
        match req {
            Request::Load(files) => self.load(files).await,
            Request::Run(code) => self.run(code).await,
            Request::Call(fn_name, args) => self.call(&fn_name, &args).await,
        }
    }
}

pub async fn call_internal<'a>(
    js_runtime: &mut JsRuntime,
    fn_name: &str,
    args: &[Value],
) -> JsResult {
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
            .and_then(|result| {
                let scope = &mut js_runtime.handle_scope();
                let local = v8::Local::new(scope, result);
                Ok(serde_v8::from_v8::<Value>(scope, local)
                    .map_err(|err| serde_v8_error_to_json(&err)))
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
