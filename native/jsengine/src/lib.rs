#[allow(unused_imports)]
mod atoms;
mod conv;
mod engine;
mod error;

use crate::conv::{json_to_term, term_to_json};
use crate::engine::Request::{Call, CreateEnv, DestroyEnv, Load, Run};
use crate::engine::{EngineManager, EnvId, Request, Response};

use deno_core::serde_json::Value;
use rustler::{Encoder, Env, Error, NifResult, Term};

use once_cell::sync::Lazy;
use std::sync::mpsc::{channel, Sender};
use std::sync::{Arc, Mutex};
use std::thread;

// Register NIFs: create_env/0, destroy_env/1, load_env/2, run_env/2, call_env/3
rustler::init!(
    "Elixir.JSEngine",
    [create_env, destroy_env, load_env, run_env, call_env],
    load = init
);

type ChannelSender = Arc<Mutex<Sender<(Request, Sender<Response>)>>>;

static GLOBAL_CHANNEL: Lazy<ChannelSender> = Lazy::new(|| {
    let (sender, receiver) = channel::<(Request, Sender<Response>)>();
    let sender = Arc::new(Mutex::new(sender));
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .expect("Failed to create Tokio runtime - this should never fail");

    /* Spawn the master thread */
    thread::spawn(move || {
        let mut engine_manager = EngineManager::new();

        for (request, response_sender) in receiver {
            let async_result = engine_manager.handle(&request);
            let result = runtime.block_on(async_result);
            let _ = response_sender.send(result);
        }
    });

    sender
});

fn init(_env: Env, _term: rustler::Term) -> bool {
    true
}

// Helper function to extract environment ID from term (supports atom :default or integer)
fn extract_env_id<'a>(env: Env<'a>, term: Term<'a>) -> Result<EnvId, Error> {
    // Try to decode as atom first (for :default)
    if term.is_atom() && term == atoms::default().encode(env) {
        return Ok(0);
    }

    // Try to decode as integer (for environment references)
    term.decode::<u64>()
        .map_err(|_| Error::Atom("invalid_env_id"))
}

#[rustler::nif(schedule = "DirtyCpu")]
fn create_env<'a>(env: Env<'a>) -> NifResult<Term<'a>> {
    send_msg_raw(env, CreateEnv)
}

#[rustler::nif(schedule = "DirtyCpu")]
fn destroy_env<'a>(env: Env<'a>, env_id_term: Term<'a>) -> NifResult<Term<'a>> {
    let env_id = extract_env_id(env, env_id_term)?;
    send_msg_raw(env, DestroyEnv(env_id))
}

#[rustler::nif(schedule = "DirtyCpu")]
fn load_env<'a>(env: Env<'a>, env_id_term: Term<'a>, js_files: Vec<String>) -> NifResult<Term<'a>> {
    let env_id = extract_env_id(env, env_id_term)?;
    send_msg_raw(env, Load(env_id, js_files))
}

#[rustler::nif(schedule = "DirtyCpu")]
fn run_env<'a>(env: Env<'a>, env_id_term: Term<'a>, code: String) -> NifResult<Term<'a>> {
    let env_id = extract_env_id(env, env_id_term)?;
    send_msg_raw(env, Run(env_id, code))
}

#[rustler::nif(schedule = "DirtyCpu")]
fn call_env<'a>(
    env: Env<'a>,
    env_id_term: Term<'a>,
    fn_name: String,
    args: Vec<Term<'a>>,
) -> NifResult<Term<'a>> {
    let env_id = extract_env_id(env, env_id_term)?;
    let json_args: Result<Vec<Value>, _> =
        args.into_iter().map(|arg| term_to_json(env, arg)).collect();

    match json_args {
        Ok(arg_vals) => send_msg_raw(env, Call(env_id, fn_name, arg_vals)),
        Err(_err) => Err(Error::Atom("invalid_type")),
    }
}

fn send_msg_raw<'a>(env: Env<'a>, msg: Request) -> NifResult<Term<'a>> {
    let (sender, receiver) = channel::<Response>();
    let global_sender = GLOBAL_CHANNEL
        .lock()
        .map_err(|_| Error::Atom("mutex_poisoned"))?;

    global_sender
        .send((msg, sender))
        .map_err(|_| Error::Atom("sender_error"))?;

    let response = receiver.recv().map_err(|_| Error::Atom("receiver_error"))?;

    match response {
        Response::EnvCreated(id) => Ok((atoms::ok(), id).encode(env)),
        Response::EnvDestroyed => Ok(atoms::ok().encode(env)),
        Response::Result(Ok(val)) => Ok((atoms::ok(), json_to_term(env, &val)).encode(env)),
        Response::Result(Err(err)) => Ok((atoms::error(), json_to_term(env, &err)).encode(env)),
    }
}
