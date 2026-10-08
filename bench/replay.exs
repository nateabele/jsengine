# Cold-start replay through jsengine isolates: the aravis bench capture (one `init`, then its
# `applyLoggedPage` calls), the same calls as aravis interop/bench/coldstart/run-pages.js, so the
# hashes compare with the Node driver's. Run from the jsengine root:
#   MIX_ENV=test mix run bench/replay.exs <bundle> <capture-dir> <mode> [runs] [held] [replies-sha1 workspace-sha1]
# <bundle>: aravis interop/dist/server-interop.min.js. <capture-dir>: interop/bench/coldstart/captures/current.
# mode: load (create_isolate + load_source) | snapshot (create_isolate from a D54 snapshot).
#
# 1. Memory, first, in a BEAM that has not run an isolate yet: `held` isolates (default 4) are
#    started and held. The physical footprint per isolate is taken when they are fresh and idle,
#    after each has replayed, after 10 s idle, and after a V8 low-memory notification
#    (`JSEngine.__test_low_memory__/1`, which wraps `low_memory_notification/1`; an older NIF without it skips that step).
# 2. Speed: `runs` replays (default 3), each in a fresh isolate.
#
# Every replay is hashed (replies and final workspace). The bench exits 1 when two replays differ,
# or when they differ from the expected pair given as the last two arguments.
[bundle, dir, mode | rest] = System.argv()
int = fn s -> String.to_integer(s) end

{runs, held, expected} =
  case rest do
    [r, h, a, b | _] -> {int.(r), int.(h), {a, b}}
    [r, h] -> {int.(r), int.(h), nil}
    [r] -> {int.(r), 4, nil}
    [] -> {3, 4, nil}
  end

code = File.read!(bundle)
pid = System.pid()
heap_mb = 256

defmodule R do
  def sh(cmd), do: :os.cmd(String.to_charlist(cmd)) |> to_string()
  def loadavg, do: sh("sysctl -n vm.loadavg") |> String.trim()
  def med(l), do: Enum.at(Enum.sort(l), div(length(l), 2))
  def f1(x), do: :erlang.float_to_binary(x / 1, decimals: 1)

  def footprint_kb(pid) do
    :erlang.garbage_collect()

    case Regex.run(~r/Physical footprint:\s+([0-9.]+)([KMG])/, sh("vmmap --summary #{pid} 2>/dev/null")) do
      [_, v, u] -> round(elem(Float.parse(v), 0) * %{"K" => 1, "M" => 1024, "G" => 1_048_576}[u])
      _ -> -1
    end
  end

  # The capture holds a JSON array (a legacy one: a JSON string of it).
  def args_json(text) do
    case :json.decode(text) do
      s when is_binary(s) -> s
      _ -> text
    end
  end

  def files(dir) do
    all =
      File.ls!(dir)
      |> Enum.flat_map(fn f ->
        case Regex.run(~r/^(\d+)-(\w+)\.json$/, f) do
          [_, n, fun] -> [{String.to_integer(n), fun, f}]
          _ -> []
        end
      end)
      |> Enum.sort()

    replay? = fn {_, fun, _} -> fun in ["applyLoggedPage", "applyLogged"] end
    first = Enum.find_index(all, replay?) || raise "no applyLoggedPage call in #{dir}"
    init = all |> Enum.take(first) |> Enum.filter(fn {_, f, _} -> f == "init" end) |> List.last()
    init || raise "no init before the first page in #{dir}"
    pages = all |> Enum.drop(first) |> Enum.take_while(replay?)
    read = fn {_, fun, f} -> {fun, args_json(File.read!(Path.join(dir, f)))} end
    {read.(init), Enum.map(pages, read)}
  end

  # Replays into `i`; returns {ms, replies sha1, workspace sha1}.
  def replay(i, {"init", init_args}, pages) do
    [id | _] = :json.decode(init_args)
    t0 = System.monotonic_time(:microsecond)
    {:ok, r} = JSEngine.call(i, "init", init_args, 60_000)
    h = :crypto.hash_update(:crypto.hash_init(:sha), r)

    h =
      Enum.reduce(pages, h, fn {fun, args}, h ->
        {:ok, r} = JSEngine.call(i, fun, args, 60_000)
        :crypto.hash_update(h, r)
      end)

    ms = (System.monotonic_time(:microsecond) - t0) / 1000
    {:ok, ws} = JSEngine.call(i, "get", IO.iodata_to_binary(:json.encode([id])), 60_000)
    hex = &Base.encode16(&1, case: :lower)
    {ms, hex.(:crypto.hash_final(h)), hex.(:crypto.hash(:sha, ws))}
  end
end

{init, pages} = R.files(dir)

snap =
  case mode do
    "load" -> nil
    "snapshot" -> (fn -> {:ok, s} = JSEngine.create_snapshot("server-interop.min.js", code); s end).()
  end

start = fn ->
  case mode do
    "load" ->
      {:ok, i} = JSEngine.create_isolate(%{heap_mb: heap_mb})
      :ok = JSEngine.load_source(i, "server-interop.min.js", code)
      i

    "snapshot" ->
      {:ok, i} = JSEngine.create_isolate(%{heap_mb: heap_mb, snapshot: snap})
      i
  end
end

la0 = R.loadavg()
cpu = R.sh("sysctl -n machdep.cpu.brand_string") |> String.trim()

# 1. Memory.
f0 = R.footprint_kb(pid)
isos = for _ <- 1..held, do: start.()
per = fn f -> div(f - f0, held) end
fresh = per.(R.footprint_kb(pid))
held_results = Enum.map(isos, &R.replay(&1, init, pages))
replayed = per.(R.footprint_kb(pid))
Process.sleep(10_000)
idle = per.(R.footprint_kb(pid))

low =
  # An older NIF has no such hook: its stub raises.
  case Enum.map(isos, fn i -> try do JSEngine.__test_low_memory__(i) rescue e -> {:error, Exception.message(e)} end end) |> Enum.uniq() do
    [{:ok, "null"}] -> per.(R.footprint_kb(pid))
    other -> "n/a (#{inspect(other)})"
  end

Enum.each(isos, &JSEngine.destroy/1)

# 2. Speed.
results =
  for _ <- 1..runs do
    i = start.()
    res = R.replay(i, init, pages)
    JSEngine.destroy(i)
    res
  end

hashes = (results ++ held_results) |> Enum.map(fn {_, a, b} -> {a, b} end) |> Enum.uniq()
times = Enum.map(results, &elem(&1, 0))

IO.puts("""
replay mode=#{mode} pages=#{length(pages)} runs=#{runs} held=#{held} cpu=#{cpu} load #{la0} -> #{R.loadavg()}
  replay ms: #{Enum.map_join(times, " / ", &R.f1/1)}  median #{R.f1(R.med(times))}
  hashes (#{length(results) + length(held_results)} replays): #{Enum.map_join(hashes, "; ", fn {a, b} -> "replies sha1=#{a} workspace sha1=#{b}" end)}
  footprint KB per isolate: fresh idle +#{fresh}, after replay +#{replayed}, after 10 s idle +#{idle}, after low-memory notification +#{low}
""")

cond do
  length(hashes) != 1 ->
    IO.puts(:stderr, "FAIL: replays differ")
    System.halt(1)

  expected != nil and hashes != [expected] ->
    IO.puts(:stderr, "FAIL: hashes differ from the expected #{inspect(expected)}")
    System.halt(1)

  true ->
    :ok
end
