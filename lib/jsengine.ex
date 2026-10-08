defmodule JSEngine do
  @moduledoc """
  V8 (deno_core) inside the BEAM.

  Two APIs live here:

    * **Isolates** (`create_isolate/1`, `load_source/3`, `call/4`,
      `low_memory_notification/2`, `destroy/1`):
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
  def isolate_low_memory(_isolate, _tag), do: error()
  @doc false
  def isolate_cancel(_ticket), do: error()
  @doc false
  def snapshot_create(_name, _code, _timeout_ms, _heap_mb), do: error()
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
    * `:heap_mb`, the limit of V8's old generation in MiB (default
      #{@default_heap_mb}). Reaching it makes the running call return
      `{:error, :oom}`. The young generation is not part of it: it adds up to
      24 MiB per isolate on top (3 semi-spaces of up to 8 MiB). It grows only
      in an isolate that allocates heavily, and V8 keeps it for the isolate's
      life (measured: about +5.5 MB after the aravis cold-start replay, none
      for a fresh isolate). Size a node for `heap_mb` + 24 MiB per isolate.
    * `:snapshot`, a snapshot from `create_snapshot/3` or `snapshot_for/3`:
      the isolate starts with that bundle already loaded (D54).

  Returns `{:ok, isolate}` or `{:error, reason}`:
    * `{:error, :badarg}`: `:snapshot` is given but is not a snapshot (`nil` included);
    * `{:error, :oom}`: `:heap_mb` is too small to hold the snapshot (under
      4 x its size), refused before V8 reads it;
    * `{:error, {:panic, msg}}`: the isolate thread could not start.

  There is no fallback here: an error is returned as is. A caller that wants
  to load the bundle when no snapshot can be had (aravis `Bundle.start`)
  does so itself.
  """
  @spec create_isolate(map()) :: {:ok, isolate()} | {:error, failure() | :badarg}
  def create_isolate(opts \\ %{}) when is_map(opts) do
    heap_mb = Map.get(opts, :heap_mb, @default_heap_mb)

    case Map.fetch(opts, :snapshot) do
      :error -> isolate_new(heap_mb)
      {:ok, snapshot} when is_reference(snapshot) -> from_snapshot(heap_mb, snapshot)
      {:ok, _} -> {:error, :badarg}
    end
  end

  # A reference that is not a snapshot resource fails the NIF's argument decoding.
  defp from_snapshot(heap_mb, snapshot) do
    isolate_new_from_snapshot(heap_mb, snapshot)
  rescue
    ArgumentError -> {:error, :badarg}
  end

  @doc """
  Loads `code` once, as `load_source/3` would, and takes a V8 startup snapshot of the heap (D54).
  An isolate created with `snapshot: snapshot` starts with `code` already loaded, without running
  its top-level code again. Every such isolate gets its own copy of the heap.

  Options: `:timeout_ms` (default #{@default_load_timeout_ms}) and `:heap_mb` (default
  #{@default_heap_mb}), the limits of the load that is snapshotted.

  Returns `{:ok, snapshot}` or `{:error, reason}`:
    * `{:error, :badarg}`: `:timeout_ms` or `:heap_mb` is not a positive integer;
    * `{:error, {:js, msg}}`: the code throws, or leaves async work (a timer) pending at load;
    * `{:error, :timeout}`: the code runs past `:timeout_ms`;
    * `{:error, :oom}`: its heap grows past `:heap_mb`;
    * `{:error, {:panic, msg}}`: a host fault.

  The snapshot is valid only in this OS process's NIF build.

  **Bundles V8 cannot snapshot.** V8 aborts the whole OS process (no error is returned) when the
  heap holds, at the end of the load, an exported WebAssembly function (a wasm instance made at
  load) or a FinalizationRegistry with pending cleanup. jsengine cannot detect these cheaply, so
  the code must not instantiate WebAssembly or register finalizers at load. asm.js is fine: V8
  runs with `--no-validate-asm`, so a `"use asm"` module is plain JavaScript.
  """
  @spec create_snapshot(String.t(), String.t(), map()) :: {:ok, snapshot()} | {:error, failure() | :badarg}
  def create_snapshot(name, code, opts \\ %{}) when is_binary(name) and is_binary(code) and is_map(opts) do
    timeout_ms = Map.get(opts, :timeout_ms, @default_load_timeout_ms)
    heap_mb = Map.get(opts, :heap_mb, @default_heap_mb)

    if positive_integer?(timeout_ms) and positive_integer?(heap_mb),
      do: snapshot_create(name, code, min(timeout_ms, @max_timeout_ms), heap_mb),
      else: {:error, :badarg}
  end

  defp positive_integer?(value), do: is_integer(value) and value > 0

  @doc """
  The snapshot of `code`, made once and kept in `:persistent_term` under `name` (options as for
  `create_snapshot/3`). The key is the SHA-256 of `code`.

  Returns `{:ok, snapshot}` or `{:error, reason}` (the reasons of `create_snapshot/3`). A snapshot
  and a deterministic failure (`{:error, {:js, msg}}`, `{:error, :oom}`) are remembered for that
  hash (an `:oom` only for the same `:heap_mb`: a call with another limit tries again): until `code` changes (or `forget_snapshot/1`), later calls return them without trying
  again. Any other failure (`:timeout`, `{:panic, msg}`, `:dead`, `:badarg`) may be transient
  (a loaded machine, a host fault, bad options) and is not remembered: the next call tries again.
  A call with changed code makes a new snapshot and replaces the entry.

  Creation is serialised per `name` (a `:global` lock on this node): concurrent first calls make
  one snapshot, and the others wait for it and return it. A waiter retries the lock after a random
  sleep (`:global` backs off from up to 250 ms, doubling to 8 s), so it can wait longer than the
  creation itself (about 70 ms for the aravis bundle). Make the snapshot once at boot, before
  workspaces start, so that waiting is rare.
  """
  @spec snapshot_for(String.t(), String.t(), map()) :: {:ok, snapshot()} | {:error, failure() | :badarg}
  def snapshot_for(name, code, opts \\ %{}) when is_binary(name) and is_binary(code) and is_map(opts) do
    key = {__MODULE__, :snapshot, name}
    sha = :crypto.hash(:sha256, code)
    heap_mb = Map.get(opts, :heap_mb, @default_heap_mb)

    case cached(key, sha, heap_mb) do
      {:ok, result} ->
        result

      :miss ->
        :global.trans({key, self()}, fn ->
          case cached(key, sha, heap_mb) do
            {:ok, result} ->
              result

            :miss ->
              result = create_snapshot(name, code, opts)
              if remembered?(result), do: :persistent_term.put(key, {sha, heap_mb, result})
              result
          end
        end, [node()])
    end
  end

  defp remembered?({:ok, _}), do: true
  defp remembered?({:error, {:js, _}}), do: true
  defp remembered?({:error, :oom}), do: true
  defp remembered?(_), do: false

  # An :oom depends on the heap limit it was made under: it answers only a call with the same
  # `:heap_mb`. A snapshot and a JS error do not depend on it.
  defp cached(key, sha, heap_mb) do
    case :persistent_term.get(key, nil) do
      {^sha, ^heap_mb, result} -> {:ok, result}
      {^sha, _other_heap, {:error, :oom}} -> :miss
      {^sha, _other_heap, result} -> {:ok, result}
      _ -> :miss
    end
  end

  @doc "Drops what `snapshot_for/3` keeps under `name` (a snapshot or a failure)."
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
  Sends V8 a low-memory notification: a full, compacting GC that also
  shrinks the young generation and returns the freed pages to the OS. V8
  never does this by itself in jsengine (it runs no idle tasks), so an
  isolate that worked hard keeps its garbage and its grown young generation
  until it is called.

  Measured (aravis bundle, D54 snapshot isolate, M5 Max; aravis
  `.superpowers/sdd/2026-10-07-low-memory/low-memory-report.md`, server
  `log_bench.exs low_memory`): after the 10k cold-start replay it takes
  about 9 ms and the workspace's footprint drops from about 47 MB to about
  12.7 MB; on a fresh isolate it takes about 2 ms and frees nothing.

  It runs on the isolate thread, queued like a call: it waits for the work
  queued before it (a call in flight finishes first), and work queued after
  it waits for it. It never runs at the same time as a call. The NIF only
  queues it (normal scheduler, no blocking); the caller waits in `receive`.

  Returns `:ok`, or `{:error, failure}`:
    * `{:error, :dead}`: the isolate was destroyed or has retired;
    * `{:error, :timeout}`: no reply within `timeout_ms` (default 30 s; it
      counts the wait in the queue too). The isolate is not discarded: the
      notification stays queued and still runs, and a stuck call in front of
      it is ended by that call's own deadline.
  """
  @spec low_memory_notification(isolate(), pos_integer()) :: :ok | {:error, failure()}
  def low_memory_notification(isolate, timeout_ms \\ 30_000)
      when is_integer(timeout_ms) and timeout_ms > 0 do
    timeout_ms = min(timeout_ms, @max_timeout_ms)
    tag = make_ref()

    case isolate_low_memory(isolate, tag) do
      {:ok, ticket} ->
        receive do
          {:jsengine_reply, ^tag, result} -> result
        after
          timeout_ms ->
            isolate_cancel(ticket)

            receive do
              {:jsengine_reply, ^tag, result} -> result
            after
              0 -> {:error, :timeout}
            end
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

  @doc false
  # The former test hook, kept for the memory benches: `low_memory_notification/1`
  # with the old reply (`{:ok, "null"}`). It now works in every build.
  def __test_low_memory__(isolate) do
    case low_memory_notification(isolate) do
      :ok -> {:ok, "null"}
      {:error, _} = error -> error
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
