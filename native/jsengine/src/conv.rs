use deno_core::serde_json::{json, Value};
use deno_core::serde_v8::Error as SerdeV8Error;
use deno_core::{anyhow, serde_json};
use rustler::{types::atom, Atom, Encoder, Env, Error, Term};
use crate::atoms;
use crate::error::Error as AtomError;

pub fn json_to_term<'a>(env: Env<'a>, value: &Value) -> Term<'a> {
    match value {
        Value::Null => atom::nil().encode(env),
        Value::Bool(b) => b.encode(env),
        Value::Number(num) => {
            if let Some(i) = num.as_i64() {
                i.encode(env)
            } else if let Some(f) = num.as_f64() {
                f.encode(env)
            } else {
                // Placeholder: Handle other number types or throw an error
                atom::nil().encode(env)
            }
        }
        Value::String(s) => s.encode(env),
        Value::Array(arr) => {
            let terms: Vec<Term> = arr.iter().map(|item| json_to_term(env, item)).collect();
            terms.encode(env)
        }
        Value::Object(obj) => {
            let terms: Vec<(Term, Term)> = obj
                .iter()
                .map(|(key, val)| (key.encode(env), json_to_term(env, val)))
                .collect();
            terms.encode(env)
        }
    }
}

pub fn term_to_json<'a>(env: Env<'a>, term: Term<'a>) -> Result<Value, rustler::Error> {
    if let Ok(_atom) = term.decode::<Atom>() {
        return Ok(Value::String(term_to_string(&term).unwrap()));
    }
    if let Ok(s) = term.decode::<String>() {
        return Ok(Value::String(s));
    }
    if let Ok(i) = term.decode::<i64>() {
        return Ok(Value::Number(i.into()));
    }
    if let Ok(f) = term.decode::<f64>() {
        return Ok(Value::Number(serde_json::Number::from_f64(f).unwrap()));
    }
    if let Ok(list) = term.decode::<Vec<Term>>() {
        let json_list: Result<Vec<_>, _> =
            list.iter().map(|item| term_to_json(env, *item)).collect();
        return Ok(Value::Array(json_list?));
    }
    if let Ok(map) = term.decode::<std::collections::HashMap<Term, Term>>() {
        let mut json_map = serde_json::Map::new();
        for (key, value) in map {
            let key_str = term_to_json(env, key)?.as_str().unwrap().to_string();
            json_map.insert(key_str, term_to_json(env, value)?);
        }
        return Ok(Value::Object(json_map));
    }
    // Handle other types or return an error
    Err(Error::Atom("invalid_type"))
}

pub fn serde_v8_error_to_json(error: &SerdeV8Error) -> Value {
    match error {
        SerdeV8Error::Message(msg) => json!({"type": "Message", "message": msg}),
        SerdeV8Error::ExpectedBoolean(expected) => {
            json!({"type": "ExpectedBoolean", "expected": expected})
        }
        SerdeV8Error::ExpectedInteger(expected) => {
            json!({"type": "ExpectedInteger", "expected": expected})
        }
        SerdeV8Error::ExpectedNumber(expected) => {
            json!({"type": "ExpectedNumber", "expected": expected})
        }
        SerdeV8Error::ExpectedString(expected) => {
            json!({"type": "ExpectedString", "expected": expected})
        }
        SerdeV8Error::ExpectedArray(expected) => {
            json!({"type": "ExpectedArray", "expected": expected})
        }
        SerdeV8Error::ExpectedMap(expected) => {
            json!({"type": "ExpectedMap", "expected": expected})
        }
        SerdeV8Error::ExpectedEnum(expected) => {
            json!({"type": "ExpectedEnum", "expected": expected})
        }
        SerdeV8Error::ExpectedObject(expected) => {
            json!({"type": "ExpectedObject", "expected": expected})
        }
        SerdeV8Error::ExpectedBuffer(expected) => {
            json!({"type": "ExpectedBuffer", "expected": expected})
        }
        SerdeV8Error::ExpectedDetachable(expected) => {
            json!({"type": "ExpectedDetachable", "expected": expected})
        }
        SerdeV8Error::ExpectedExternal(expected) => {
            json!({"type": "ExpectedExternal", "expected": expected})
        }
        SerdeV8Error::ExpectedBigInt(expected) => {
            json!({"type": "ExpectedBigInt", "expected": expected})
        }
        SerdeV8Error::ExpectedUtf8 => json!({"type": "ExpectedUtf8"}),
        SerdeV8Error::ExpectedLatin1 => json!({"type": "ExpectedLatin1"}),
        SerdeV8Error::UnsupportedType => json!({"type": "UnsupportedType"}),
        SerdeV8Error::LengthMismatch(got, expected) => {
            json!({"type": "LengthMismatch", "got": got, "expected": expected})
        }
        SerdeV8Error::ResizableBackingStoreNotSupported => {
            json!({"type": "ResizableBackingStoreNotSupported"})
        }
        &_ => json!({"type": "error::unknown"}),
    }
}

pub fn anyhow_error_to_json(error: &anyhow::Error) -> Value {
    Value::String(format!("{:?}", error))
}

/**
 * Attempts to create a `String` from the term.
 */
pub fn term_to_string(term: &Term) -> Result<String, AtomError> {
    if atoms::ok().eq(term) {
        Ok(atoms::OK.to_string())
    } else if atoms::error().eq(term) {
        Ok(atoms::ERROR.to_string())
    } else if term.is_atom() {
        term.atom_to_string().or(Err(AtomError::InvalidAtom))
    } else {
        Err(AtomError::InvalidStringable)
    }
}
