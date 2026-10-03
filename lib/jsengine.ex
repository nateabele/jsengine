defmodule JSEngine do
  @moduledoc """
  V8 (deno_core) inside the BEAM.

  Two APIs live here:

    * **Isolates** (`create_isolate/1`, `load_source/3`, `call/4`, `destroy/1`):
      one OS thread per isolate, a heap limit, a deadline per call, and a
      structured error for every host failure. Use this API.
    * **Environments** (`create_env/0`, `load/2`, `run/2`, `call/3`, ...): the
      original API. All environments share one engine thread. Deprecated; it
      stays until the Aravis server has moved to isolates.

  ## Failures

  `t:failure/0` is the closed set of errors an isolate returns. `:timeout`,
  `:oom`, `{:panic, msg}` and `:dead` mean the isolate is gone: create a new
  one. `{:js, msg}` is a JavaScript error; the isolate stays usable.
  """

  use Rustler,
    otp_app: :jsengine,
    crate: :jsengine,
    features: if(Mix.env() == :test, do: ["test_hooks"], else: [])

  @typedoc "A V8 isolate on its own OS thread (an opaque NIF resource)."
  @type isolate :: reference()

  @type failure ::
          :timeout | :oom | {:panic, String.t()} | {:js, String.t()} | :dead

  @default_heap_mb 256
  @default_load_timeout_ms 30_000
  # Extra wait after the deadline before the caller gives up on a reply.
  @reply_grace_ms 5_000

  # NIFs - these are replaced by Rust implementations
  def create_env(), do: error()
  def destroy_env(_env_id), do: error()
  def load_env(_env_id, _files), do: error()
  def run_env(_env_id, _code), do: error()
  def call_env(_env_id, _function_name, _args), do: error()

  @doc false
  def isolate_new(_heap_mb), do: error()
  @doc false
  def isolate_load(_isolate, _name, _code, _timeout_ms, _tag), do: error()
  @doc false
  def isolate_call(_isolate, _fun_name, _args_json, _timeout_ms, _tag), do: error()
  @doc false
  def isolate_destroy(_isolate), do: error()
  @doc false
  def isolate_alive(_isolate), do: error()
  @doc false
  def isolate_test_panic(_isolate, _tag), do: error()

  @doc """
  Starts an isolate on its own OS thread.

  Options: `:heap_mb`, the V8 heap limit in MiB (default #{@default_heap_mb}).
  Reaching the limit makes the running call return `{:error, :oom}`.
  """
  @spec create_isolate(map()) :: {:ok, isolate()} | {:error, failure()}
  def create_isolate(opts \\ %{}) when is_map(opts) do
    heap_mb = Map.get(opts, :heap_mb, @default_heap_mb)
    isolate_new(heap_mb)
  end

  @doc """
  Runs `code` as a classic script in the isolate. `name` is the script name in
  stack traces. The code is never transpiled and never sniffed for TypeScript
  or ES module syntax, so a minified bundle loads as is.
  """
  @spec load_source(isolate(), String.t(), String.t()) :: :ok | {:error, failure()}
  def load_source(isolate, name, code),
    do: load_source(isolate, name, code, @default_load_timeout_ms)

  @doc "`load_source/3` with an explicit deadline in milliseconds."
  @spec load_source(isolate(), String.t(), String.t(), pos_integer()) ::
          :ok | {:error, failure()}
  def load_source(isolate, name, code, timeout_ms)
      when is_binary(name) and is_binary(code) and is_integer(timeout_ms) and timeout_ms > 0 do
    tag = make_ref()

    case isolate_load(isolate, name, code, timeout_ms, tag) do
      :ok ->
        # The receive sits next to make_ref/0 so the BEAM skips older
        # messages in a long mailbox instead of scanning them.
        receive do
          {:jsengine_reply, ^tag, result} -> result
        after
          timeout_ms + @reply_grace_ms -> give_up(isolate)
        end

      {:error, _} = error ->
        error
    end
  end

  @doc """
  Calls `globalThis[fun_name]` with the elements of `args_json` (a JSON array,
  as a binary) as arguments. A returned promise is awaited. The result is
  `JSON.stringify` of the value, as a binary (`undefined` gives `"null"`).

  The whole call, including awaiting the promise, must finish within
  `timeout_ms`, or the result is `{:error, :timeout}` and the isolate is gone.
  """
  @spec call(isolate(), String.t(), String.t(), pos_integer()) ::
          {:ok, String.t()} | {:error, failure()}
  def call(isolate, fun_name, args_json, timeout_ms)
      when is_binary(fun_name) and is_binary(args_json) and is_integer(timeout_ms) and
             timeout_ms > 0 do
    tag = make_ref()

    case isolate_call(isolate, fun_name, args_json, timeout_ms, tag) do
      :ok ->
        # The receive sits next to make_ref/0 so the BEAM skips older
        # messages in a long mailbox instead of scanning them.
        receive do
          {:jsengine_reply, ^tag, result} -> result
        after
          timeout_ms + @reply_grace_ms -> give_up(isolate)
        end

      {:error, _} = error ->
        error
    end
  end

  @doc """
  Discards the isolate: stops a running call, frees its heap and ends its
  thread (waits up to 2 s). Later calls return `{:error, :dead}`.
  """
  @spec destroy(isolate()) :: :ok
  def destroy(isolate), do: isolate_destroy(isolate)

  @doc "False once the isolate has been discarded."
  @spec alive?(isolate()) :: boolean()
  def alive?(isolate), do: isolate_alive(isolate)

  @doc false
  # Test hook: panics the isolate thread. Returns `{:error, :unsupported}`
  # unless the NIF was built with the `test_hooks` feature (MIX_ENV=test).
  def __test_panic__(isolate) do
    tag = make_ref()

    case isolate_test_panic(isolate, tag) do
      :ok ->
        receive do
          {:jsengine_reply, ^tag, result} -> result
        after
          5_000 + @reply_grace_ms -> give_up(isolate)
        end

      {:error, _} = error ->
        error
    end
  end

  # The isolate thread did not answer even after the grace period (it is
  # stuck outside JavaScript). Discard it; a late reply is a stray
  # `{:jsengine_reply, _, _}` message that the caller must ignore.
  defp give_up(isolate) do
    isolate_destroy(isolate)
    {:error, :timeout}
  end

  # Convenience wrappers for default environment
  def load(files) when is_list(files), do: load_env(:default, files)
  def run(code) when is_binary(code), do: run_env(:default, code)

  def call(function_name, args \\ []) when is_binary(function_name),
    do: call_env(:default, function_name, args)

  # Support both default and custom environments
  def load(env_id, files) when is_list(files), do: load_env(env_id, files)
  def run(env_id, code) when is_binary(code), do: run_env(env_id, code)

  def call(env_id, function_name, args) when is_binary(function_name),
    do: call_env(env_id, function_name, args)

  defp error(), do: :erlang.nif_error(:nif_not_loaded)
end
