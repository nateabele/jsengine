defmodule JSEngine do
  @moduledoc """
  V8 (deno_core) inside the BEAM.

  Two APIs live here:

    * **Isolates** (`create_isolate/1`, `load_source/3`, `call/4`, `destroy/1`):
      one OS thread per isolate, a heap limit, a deadline per call, and a
      structured error for every host failure. Use this API.
    * **Startup snapshots** (`create_snapshot/3`, `snapshot_for/3`): load a
      bundle once, snapshot the V8 heap, and start isolates from it with
      `create_isolate(%{snapshot: snapshot})`, so the bundle's top-level code
      never runs again (D54). A snapshot is valid only for this NIF build.
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

  @typedoc "A V8 startup snapshot of a loaded bundle (an opaque NIF resource, D54)."
  @type snapshot :: reference()

  @type failure ::
          :timeout | :oom | {:panic, String.t()} | {:js, String.t()} | :dead

  @default_heap_mb 256
  @default_load_timeout_ms 30_000
  # Longer deadlines are clamped to this (24 h), here and in the NIF, so a
  # huge value cannot overflow `receive ... after` or Rust's `Instant`.
  @max_timeout_ms 86_400_000
  # Extra wait after the deadline before the caller gives up on a reply.
  # Configurable (`config :jsengine, reply_grace_ms: ...`) for tests only.
  @default_reply_grace_ms 5_000

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
  @doc false
  def isolate_test_stall(_isolate, _stall_ms, _timeout_ms, _tag), do: error()
  @doc false
  def isolate_cancel(_ticket), do: error()
  @doc false
  def snapshot_create(_name, _code, _timeout_ms), do: error()
  @doc false
  def isolate_new_from_snapshot(_heap_mb, _snapshot), do: error()
  @doc "`%{bundle_sha256: hex, size: bytes, build_id: string}` of a snapshot."
  @spec snapshot_info(snapshot()) :: %{bundle_sha256: String.t(), size: non_neg_integer(), build_id: String.t()}
  def snapshot_info(_snapshot), do: error()
  @doc """
  The snapshot as a binary for a cache. It is stamped with the build id of this NIF: only the same
  binary reads it back.
  """
  @spec snapshot_to_binary(snapshot()) :: {:ok, binary()} | {:error, failure()}
  def snapshot_to_binary(_snapshot), do: error()
  @doc """
  Reads a binary written by `snapshot_to_binary/1`. `{:error, :stale}`: another build of jsengine
  wrote it (make the snapshot again). `{:error, :corrupt}`: not a snapshot, or damaged. V8 never sees
  refused bytes (it aborts the process on a snapshot it cannot read).
  """
  @spec snapshot_from_binary(binary()) :: {:ok, snapshot()} | {:error, :stale | :corrupt}
  def snapshot_from_binary(_binary), do: error()

  @doc """
  Starts an isolate on its own OS thread.

  Options:
    * `:heap_mb`, the V8 heap limit in MiB (default #{@default_heap_mb}).
      Reaching the limit makes the running call return `{:error, :oom}`.
    * `:snapshot`, a snapshot from `create_snapshot/3` or `snapshot_for/3`:
      the isolate starts with that bundle already loaded (D54).
  """
  @spec create_isolate(map()) :: {:ok, isolate()} | {:error, failure()}
  def create_isolate(opts \\ %{}) when is_map(opts) do
    heap_mb = Map.get(opts, :heap_mb, @default_heap_mb)

    case Map.get(opts, :snapshot) do
      nil -> isolate_new(heap_mb)
      snapshot -> isolate_new_from_snapshot(heap_mb, snapshot)
    end
  end

  @doc """
  Loads `code` once, as `load_source/3` would, and takes a V8 startup snapshot of the heap (D54).
  An isolate created with `snapshot: snapshot` starts with `code` already loaded, without running
  its top-level code again. Every such isolate gets its own copy of the heap.

  The snapshot is valid only in this OS process's NIF build. Refused with `{:error, {:js, msg}}`:
  code that throws, and code that leaves async work (a timer) pending at load. Code that runs past
  `timeout_ms` (default #{@default_load_timeout_ms}) is stopped: `{:error, :timeout}`.
  """
  @spec create_snapshot(String.t(), String.t(), pos_integer()) :: {:ok, snapshot()} | {:error, failure()}
  def create_snapshot(name, code, timeout_ms \\ @default_load_timeout_ms)
      when is_binary(name) and is_binary(code) and is_integer(timeout_ms) and timeout_ms > 0,
      do: snapshot_create(name, code, min(timeout_ms, @max_timeout_ms))

  @doc """
  The snapshot of `code`, made once and kept in `:persistent_term` under `name`. The key is the
  SHA-256 of `code`: a call with changed code makes a new snapshot and replaces the old one.
  """
  @spec snapshot_for(String.t(), String.t(), pos_integer()) :: {:ok, snapshot()} | {:error, failure()}
  def snapshot_for(name, code, timeout_ms \\ @default_load_timeout_ms) when is_binary(name) and is_binary(code) do
    key = {__MODULE__, :snapshot, name}
    sha = :crypto.hash(:sha256, code)

    case :persistent_term.get(key, nil) do
      {^sha, snapshot} ->
        {:ok, snapshot}

      _ ->
        with {:ok, snapshot} <- create_snapshot(name, code, timeout_ms) do
          :persistent_term.put(key, {sha, snapshot})
          {:ok, snapshot}
        end
    end
  end

  @doc "Drops the snapshot `snapshot_for/3` keeps under `name`."
  @spec forget_snapshot(String.t()) :: :ok
  def forget_snapshot(name) do
    :persistent_term.erase({__MODULE__, :snapshot, name})
    :ok
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
    timeout_ms = min(timeout_ms, @max_timeout_ms)
    tag = make_ref()

    case isolate_load(isolate, name, code, timeout_ms, tag) do
      {:ok, ticket} ->
        # The receive sits next to make_ref/0 so the BEAM skips older
        # messages in a long mailbox instead of scanning them.
        receive do
          {:jsengine_reply, ^tag, result} -> result
        after
          timeout_ms + reply_grace_ms() -> give_up(isolate, ticket, tag)
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
  A `timeout_ms` above 24 hours is clamped to 24 hours.

  The caller waits in `receive` for a `{:jsengine_reply, tag, result}`
  message. If the isolate thread is stuck outside JavaScript and has not
  answered 5 s after the deadline, the request is cancelled, the isolate is
  destroyed, and the result is `{:error, :timeout}`. A cancelled request never
  sends its reply, so a `GenServer` caller gets no stray message.
  """
  @spec call(isolate(), String.t(), String.t(), pos_integer()) ::
          {:ok, String.t()} | {:error, failure()}
  def call(isolate, fun_name, args_json, timeout_ms)
      when is_binary(fun_name) and is_binary(args_json) and is_integer(timeout_ms) and
             timeout_ms > 0 do
    timeout_ms = min(timeout_ms, @max_timeout_ms)
    tag = make_ref()

    case isolate_call(isolate, fun_name, args_json, timeout_ms, tag) do
      {:ok, ticket} ->
        # The receive sits next to make_ref/0 so the BEAM skips older
        # messages in a long mailbox instead of scanning them.
        receive do
          {:jsengine_reply, ^tag, result} -> result
        after
          timeout_ms + reply_grace_ms() -> give_up(isolate, ticket, tag)
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
      {:ok, ticket} ->
        receive do
          {:jsengine_reply, ^tag, result} -> result
        after
          5_000 + reply_grace_ms() -> give_up(isolate, ticket, tag)
        end

      {:error, _} = error ->
        error
    end
  end

  @doc false
  # Test hook: like `call/4`, but the isolate thread sleeps `stall_ms` outside
  # JavaScript, where the deadline cannot stop it. `test_hooks` builds only.
  def __test_stall__(isolate, stall_ms, timeout_ms) do
    tag = make_ref()

    case isolate_test_stall(isolate, stall_ms, timeout_ms, tag) do
      {:ok, ticket} ->
        receive do
          {:jsengine_reply, ^tag, result} -> result
        after
          timeout_ms + reply_grace_ms() -> give_up(isolate, ticket, tag)
        end

      {:error, _} = error ->
        error
    end
  end

  # The isolate thread did not answer even after the grace period (it is
  # stuck outside JavaScript). Cancel the request first, so the isolate
  # thread never sends its reply, then flush a reply that was already in
  # flight. No stray `{:jsengine_reply, _, _}` reaches the caller's mailbox.
  # Then discard the isolate.
  defp give_up(isolate, ticket, tag) do
    isolate_cancel(ticket)

    receive do
      {:jsengine_reply, ^tag, _} -> :ok
    after
      0 -> :ok
    end

    isolate_destroy(isolate)
    {:error, :timeout}
  end

  defp reply_grace_ms,
    do: Application.get_env(:jsengine, :reply_grace_ms, @default_reply_grace_ms)

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
