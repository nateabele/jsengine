pub mod atoms;
pub mod conv;
mod error;

use crate::conv::{json_to_term, term_to_json, serde_v8_error_to_json, anyhow_error_to_json};

use deno_core::{anyhow, v8, op2, serde_v8, Extension, FastString, JsRuntime, ModuleCode, Op, RuntimeOptions};
use deno_core::serde_json::Value;
use deno_core::error::AnyError;
use std::sync::Mutex;
use lazy_static::lazy_static;
use rustler::{Encoder, Env, NifResult, Term};
use tokio;

rustler::init!("Elixir.JSEngine", [load, run, call], load = init);

type JsResult = Result<Value, Value>;

struct Engine {
    runtime: JsRuntime
}

unsafe impl Sync for Engine {}
unsafe impl Send for Engine {}

lazy_static! {
    static ref REGISTRY: Mutex<Engine> = Mutex::new(Engine {
        runtime: JsRuntime::new(RuntimeOptions {
            extensions: vec![Extension {
                name: "core:apis",
                ops: std::borrow::Cow::Borrowed(&[op_set_timeout::DECL]),
                ..Default::default()
            }],
            ..Default::default()
        })
    });
}

fn init(_env: Env, _term: rustler::Term) -> bool {
    let mut engine = REGISTRY.lock().unwrap();
    engine.runtime.execute_script_static("[core:runtime]", include_str!("./runtime.js")).unwrap();
    true
}

#[rustler::nif(schedule = "DirtyCpu")]
fn load<'a>(env: Env<'a>, js_files: Vec<String>) -> NifResult<Term<'a>> {
    let runtime = tokio::runtime::Builder::new_current_thread().enable_all().build().unwrap();

    match REGISTRY.lock() {
        Ok(mut engine) => {
            for file_path in js_files {
                let contents = std::fs::read_to_string(file_path).expect("File read error");
                let _ = runtime.block_on(eval(&mut engine.runtime, &contents));
            }
            Ok(atoms::ok().encode(env))
        },
        Err(_poison_error) => {
            Err(rustler::Error::Atom("mutex_poisoned"))
        }
    }
}

#[rustler::nif]
fn run<'a>(env: Env<'a>, code: String) -> NifResult<Term<'a>> {
    let runtime = tokio::runtime::Builder::new_current_thread().enable_all().build().unwrap();
    let result = REGISTRY.lock().map(|mut engine| runtime.block_on(eval(&mut engine.runtime, &code)));

    match result {
        Ok(Ok(val)) => Ok((atoms::ok(), json_to_term(env, &val)).encode(env)),
        Ok(Err(err)) => Ok((atoms::error(), json_to_term(env, &err)).encode(env)),
        Err(_poison_error) => Err(rustler::Error::Atom("mutex_poisoned"))
    }
}

#[rustler::nif]
fn call<'a>(env: Env<'a>, fn_name: String, args: Vec<Term<'a>>) -> NifResult<Term<'a>> {
    let runtime = tokio::runtime::Builder::new_current_thread().enable_all().build().unwrap();
    let result = REGISTRY.lock().map(|mut engine| {
        runtime.block_on(call_internal(
            &mut engine.runtime,
            &fn_name,
            &args.into_iter().map(|arg| term_to_json(env, arg).unwrap()).collect()
        ))
    });

    match result {
        Ok(Ok(val)) => Ok((atoms::ok(), json_to_term(env, &val)).encode(env)),
        Ok(Err(err)) => Ok((atoms::error(), json_to_term(env, &err)).encode(env)),
        Err(_poison_error) => Err(rustler::Error::Atom("mutex_poisoned"))
    }
}

async fn call_internal<'a>(js_runtime: &mut JsRuntime, fn_name: &String, args: &Vec<Value>) -> JsResult {

    let call_result = {
        let scope = &mut js_runtime.handle_scope();
        let context = scope.get_current_context();
        let global = context.global(scope);

        let fn_key = v8::String::new(scope, fn_name).unwrap();
        let func = global.get(scope, fn_key.into()).unwrap();
        let func = v8::Local::<v8::Function>::try_from(func);

        match func {
            Ok(func) => {
                let v8_args: Vec<v8::Local<v8::Value>> = args
                    .into_iter()
                    .map(|arg| serde_v8::to_v8(scope, arg).unwrap())
                    .collect();
    
                // @TODO: Remove unwrap, handle safely
                let local = func.call(scope, global.into(), &v8_args).unwrap();
                Ok(v8::Global::new(scope, local))
            },
            Err(_) => Err(Value::String(format!("{} is not a callable function", fn_name)))
        }
    };

    match call_result {
        Ok(result) => {
            let encoded = js_runtime.resolve_value(result).await.map(|result| {
                let scope = &mut js_runtime.handle_scope();
                let local = v8::Local::new(scope, result);
                serde_v8::from_v8::<Value>(scope, local)
            });
        
            match encoded {
                Ok(Ok(value)) => Ok(value),
                Ok(Err(err)) => Err(serde_v8_error_to_json(&err)),
                Err(err) => Err(anyhow_error_to_json(&err)),
            }
        },
        Err(err) => Err(err)
    }
}

async fn eval(context: &mut JsRuntime, code: &String) -> JsResult {
    let result = eval_raw(context, code).await.map(|val| {
        let scope = &mut context.handle_scope();
        let local = v8::Local::new(scope, val);
        serde_v8::from_v8::<Value>(scope, local)
    });

    match result {
        Ok(Ok(value)) => Ok(value),
        Ok(Err(err)) => Err(serde_v8_error_to_json(&err)),
        Err(err) => Err(anyhow_error_to_json(&err)),
    }
}

async fn eval_raw(js_runtime: &mut JsRuntime, code: &String) -> Result<v8::Global<v8::Value>, anyhow::Error> {
    let module: ModuleCode = FastString::from(code.to_owned());
    let result = js_runtime.execute_script("[core]", module);

    match result {
        Ok(value) => {
            let resolved = js_runtime.resolve_value(value);
            resolved.await
        },
        Err(err) => {
            Err(err)
        }
    }
}

#[op2(async)]
async fn op_set_timeout(#[serde] delay: u64) -> Result<(), AnyError> {
    tokio::time::sleep(std::time::Duration::from_millis(delay)).await;
    Ok(())
}
