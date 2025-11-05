#[allow(unused_imports)]
mod atoms;
mod conv;
mod engine;
mod error;

use crate::conv::{json_to_term, term_to_json};
use crate::engine::Request::{Call, Load, Run};
use crate::engine::{Engine, JsResult, Request};

use deno_core::serde_json::Value;
use rustler::{Encoder, Env, Error, NifResult, Term};

use once_cell::sync::Lazy;
use std::sync::mpsc::{channel, Sender};
use std::sync::{Arc, Mutex};
use std::thread;

rustler::init!("Elixir.JSEngine", [load, run, call], load = init);

type ChannelSender = Arc<Mutex<Sender<(Request, Sender<JsResult>)>>>;

static GLOBAL_CHANNEL: Lazy<ChannelSender> = Lazy::new(|| {
    let (sender, receiver) = channel::<(Request, Sender<JsResult>)>();
    let sender = Arc::new(Mutex::new(sender));
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .expect("Failed to create Tokio runtime - this should never fail");

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
    true
}

#[rustler::nif(schedule = "DirtyCpu")]
fn load<'a>(env: Env<'a>, js_files: Vec<String>) -> NifResult<Term<'a>> {
    send_msg(env, Load(js_files))
}

#[rustler::nif(schedule = "DirtyCpu")]
fn run<'a>(env: Env<'a>, code: String) -> NifResult<Term<'a>> {
    send_msg(env, Run(code))
}

#[rustler::nif(schedule = "DirtyCpu")]
fn call<'a>(env: Env<'a>, fn_name: String, args: Vec<Term<'a>>) -> NifResult<Term<'a>> {
    let json_args: Result<Vec<Value>, _> =
        args.into_iter().map(|arg| term_to_json(env, arg)).collect();

    match json_args {
        Ok(arg_vals) => send_msg(env, Call(fn_name, arg_vals)),
        Err(_err) => Err(Error::Atom("invalid_type")),
    }
}

fn send_msg<'a>(env: Env<'a>, msg: Request) -> NifResult<Term<'a>> {
    let (sender, receiver) = channel::<JsResult>();
    let global_sender = GLOBAL_CHANNEL
        .lock()
        .map_err(|_| Error::Atom("mutex_poisoned"))?;

    global_sender
        .send((msg, sender))
        .map_err(|_| Error::Atom("sender_error"))?;

    let result = receiver.recv().map_err(|_| Error::Atom("receiver_error"))?;

    match result {
        Ok(val) => Ok((atoms::ok(), json_to_term(env, &val)).encode(env)),
        Err(err) => Ok((atoms::error(), json_to_term(env, &err)).encode(env)),
    }
}
