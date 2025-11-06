//! Constants and utilities for conversion between Rust string-likes and Elixir atoms.

use crate::error::Error;
use lazy_static::lazy_static;
use rustler::{types::atom::Atom, Encoder, Env, Term};

lazy_static! {
    pub static ref OK: String = String::from("Ok");
    pub static ref ERROR: String = String::from("Err");
}

rustler::atoms! {
    nil,
    ok,
    error,

    eof,

    // Posix
    enoent, // File does not exist
    eacces, // Permission denied
    epipe, // Broken pipe
    eexist, // File exists

    unknown, // Other error
    true_ = "true",
    false_ = "false",
    __struct__,

    // Environment management
    default
}
