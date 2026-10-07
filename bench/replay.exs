# Cold-start replay through a jsengine isolate: the aravis bench capture (one `init`, then its
# `applyLoggedPage` calls), the same calls as aravis interop/bench/coldstart/run-pages.js, so the
# hashes compare with the Node driver's. Run from the jsengine root:
#   mix run bench/replay.exs <bundle> <capture-dir> <mode> [runs] [held]
# <bundle>: aravis interop/dist/server-interop.min.js. <capture-dir>: interop/bench/coldstart/captures/current.
# mode: load (create_isolate + load_source) | snapshot (create_isolate from a D54 snapshot).
# Each run replays in a fresh isolate. Then `held` isolates (default 4) each replay and stay alive,
# for the physical footprint per replayed isolate.
[bundle, dir, mode | rest] = System.argv()
{runs, held} =
  case rest do
    [r, h | _] -> {String.to_integer(r), String.to_integer(h)}
    [r] -> {String.to_integer(r), 4}
    [] -> {3, 4}
  end

code = File.read!(bundle)
pid = System.pid()
heap_mb = 256

defmodule R do
  def sh(cmd), do: :os.cmd(String.to_charlist(cmd)) |> to_string()
  def loadavg, do: sh("sysctl -n vm.loadavg") |> String.trim()
  def med(l), do: Enum.at(Enum.sort(l), div(length(l), 2))

  def footprint_kb(pid) do
    case Regex.run(~r/Physical footprint:\s+([0-9.]+)([KMG])/, sh("vmmap --summary #{pid} 2>/dev/null")) do
      [_, v, u] -> round(elem(Float.parse(v), 0) * %{"K" => 1, "M" => 1024, "G" => 1_048_576}[u])
      _ -> -1
    end
  end

  def rss_kb(pid), do: sh("ps -o rss= -p #{pid}") |> String.trim() |> String.to_integer()

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
    first = Enum.find_index(all, replay?)
    {:ok, init} = all |> Enum.take(first) |> Enum.filter(fn {_, f, _} -> f == "init" end) |> List.last() |> then(&{:ok, &1})
    pages = all |> Enum.drop(first) |> Enum.take_while(replay?)
    read = fn {_, fun, f} -> {fun, args_json(File.read!(Path.join(dir, f)))} end
    {read.(init), Enum.map(pages, read)}
  end

  # Replays into `i`; returns {ms, replies sha1, workspace sha1}.
  def replay(i, {"init", init_args}, pages) do
    [id | _] = :json.decode(init_args)
    t0 = System.monotonic_time(:microsecond)
    h = :crypto.hash_init(:sha)
    {:ok, r} = JSEngine.call(i, "init", init_args, 60_000)
    h = :crypto.hash_update(h, r)

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

results =
  for _ <- 1..runs do
    i = start.()
    res = R.replay(i, init, pages)
    JSEngine.destroy(i)
    res
  end

la1 = R.loadavg()
:erlang.garbage_collect()
f0 = R.footprint_kb(pid)
r0 = R.rss_kb(pid)
isos = for _ <- 1..held, do: (i = start.(); R.replay(i, init, pages); i)
f1 = R.footprint_kb(pid)
r1 = R.rss_kb(pid)
Enum.each(isos, &JSEngine.destroy/1)

hashes = results |> Enum.map(fn {_, a, b} -> {a, b} end) |> Enum.uniq()
times = Enum.map(results, &elem(&1, 0))

IO.puts("""
replay mode=#{mode} pages=#{length(pages)} runs=#{runs} cpu=#{cpu} load #{la0} -> #{la1}
  replay ms: #{Enum.map_join(times, " / ", &:erlang.float_to_binary(&1, decimals: 1))}  median #{:erlang.float_to_binary(R.med(times), decimals: 1)}
  hashes: #{Enum.map_join(hashes, "; ", fn {a, b} -> "replies sha1=#{a} workspace sha1=#{b}" end)}
  memory (#{held} replayed isolates held): footprint +#{div(f1 - f0, held)} KB, rss +#{div(r1 - r0, held)} KB per isolate  [load #{R.loadavg()}]
""")
