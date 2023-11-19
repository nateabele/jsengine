#[allow(unused_imports)]

mod atoms;
mod conv;
mod error;
mod engine;

use crate::conv::{json_to_term, term_to_json};
use crate::engine::{Engine, JsResult, Request};
use crate::engine::Request::{Load, Call, Run};

use deno_core::serde_json::Value;
use rustler::{Encoder, Env, NifResult, Term};

use std::thread;
use std::sync::{Arc, Mutex};
use std::sync::mpsc::{channel, Sender};
use once_cell::sync::Lazy;
use tokio;

rustler::init!("Elixir.JSEngine", [load, run, call], load = init);

static GLOBAL_CHANNEL: Lazy<Arc<Mutex<Sender<(Request, Sender<JsResult>)>>>> = Lazy::new(|| {
    let (sender, receiver) = channel::<(Request, Sender<JsResult>)>();
    let sender = Arc::new(Mutex::new(sender));
    let runtime = tokio::runtime::Builder::new_current_thread().enable_all().build().unwrap();

    /* Spawn the master thread */
    thread::spawn(move || {
        let mut engine = Engine::new();

        for (request, response_sender) in receiver {
            let async_result = engine.handle(&request);
            let result = runtime.block_on(async_result);
            let _ = response_sender.send(result);
        }
    });

    sender
});


fn init(_env: Env, _term: rustler::Term) -> bool {
    // engine.runtime.execute_script_static("[core:runtime]", include_str!("./runtime.js")).unwrap();
    true
}

#[rustler::nif(schedule = "DirtyCpu")]
fn load<'a>(env: Env<'a>, js_files: Vec<String>) -> NifResult<Term<'a>> {
    let (sender, receiver) = channel::<JsResult>();

    // @TODO Handle unwraps
    let global_sender = GLOBAL_CHANNEL.lock().unwrap();
    global_sender.send((Load(js_files), sender)).unwrap();

    let result = receiver.recv().unwrap();

    // match REGISTRY.lock() {
    //     Ok(mut engine) => {
    //         Ok(atoms::ok().encode(env))
    //     },
    //     Err(_poison_error) => {
    //         Err(rustler::Error::Atom("mutex_poisoned"))
    //     }
    // }
    Ok(match result {
        Ok(value) => (atoms::ok(), json_to_term(env, &value)).encode(env),
        Err(err) => (atoms::error(), json_to_term(env, &err)).encode(env)
    })
    
}

#[rustler::nif]
fn run<'a>(env: Env<'a>, code: String) -> NifResult<Term<'a>> {
    let (sender, receiver) = channel::<JsResult>();

    // @TODO Handle unwraps
    let global_sender = GLOBAL_CHANNEL.lock().unwrap();
    global_sender.send((Run(code), sender)).unwrap();

    let result = receiver.recv().unwrap();

    Ok(match result {
        Ok(val) => (atoms::ok(), json_to_term(env, &val)).encode(env),
        Err(err) => (atoms::error(), json_to_term(env, &err)).encode(env),
        // Err(_poison_error) => Err(rustler::Error::Atom("mutex_poisoned"))
    })
}

#[rustler::nif]
fn call<'a>(env: Env<'a>, fn_name: String, args: Vec<Term<'a>>) -> NifResult<Term<'a>> {
    let json_args: Vec<Value> = args.into_iter().map(|arg| term_to_json(env, arg).unwrap()).collect();
    let (sender, receiver) = channel::<JsResult>();

    // @TODO Handle unwraps
    let global_sender = GLOBAL_CHANNEL.lock().unwrap();
    global_sender.send((Call(fn_name, json_args.into()), sender)).unwrap();

    let _result = receiver.recv().unwrap();

    // match result {
    //     Ok(Ok(val)) => Ok((atoms::ok(), json_to_term(env, &val)).encode(env)),
    //     Ok(Err(err)) => Ok((atoms::error(), json_to_term(env, &err)).encode(env)),
    //     Err(_poison_error) => Err(rustler::Error::Atom("mutex_poisoned"))
    // }

    Ok(atoms::ok().encode(env))
}
