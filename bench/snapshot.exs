# D54: bundle load vs start from a startup snapshot (process CPU, wall, first apply, footprint).
# Run from the jsengine root after `mix compile`; <bundle> is aravis interop/dist/server-interop.min.js:
#   elixir -pa _build/dev/lib/jsengine/ebin <this> <mode> <bundle> [n]
# mode: baseline (create_isolate + load_source) | snapshot (create_isolate from a snapshot)
[mode, bundle | rest] = System.argv()
n = case rest do [x | _] -> String.to_integer(x); _ -> 15 end
code = File.read!(bundle)
pid = System.pid()

defmodule P do
  def sh(cmd), do: :os.cmd(String.to_charlist(cmd)) |> to_string()

  # ps -o time: [[dd-]hh:]mm:ss.cc (10 ms resolution)
  def cpu_ms(pid) do
    [s | rest] = sh("ps -o time= -p #{pid}") |> String.trim() |> String.split(["-", ":"]) |> Enum.reverse()
    {sec, ""} = Float.parse(s)
    whole = rest |> Enum.zip([60, 3600, 86_400]) |> Enum.map(fn {v, m} -> String.to_integer(v) * m end) |> Enum.sum()
    round((sec + whole) * 1000)
  end

  def footprint_kb(pid) do
    case Regex.run(~r/Physical footprint:\s+([0-9.]+)([KMG])/, sh("vmmap --summary #{pid} 2>/dev/null")) do
      [_, v, u] -> round(elem(Float.parse(v), 0) * %{"K" => 1, "M" => 1024, "G" => 1_048_576}[u])
      _ -> -1
    end
  end

  def loadavg, do: sh("sysctl -n vm.loadavg") |> String.trim()
  def med(l), do: Enum.at(Enum.sort(l), div(length(l), 2))
  def ms(us), do: Float.round(us / 1000, 1)
end

coords = %{"pos" => %{"x" => 0, "y" => 0}, "size" => %{"width" => 10, "height" => 10}}
ws = "d54-ws"
workspace = %{"wire" => 1, "id" => ws, "title" => "T", "owner" => "u1", "items" => ["rec1"], "streams" => [],
  "builtins" => %{"signatures" => %{}, "decls" => %{}}, "names" => %{}, "order" => %{}}
object = %{"wire" => 1, "workspace" => ws, "id" => "rec1", "meta" => %{}, "coords" => coords,
  "def" => %{"kind" => "data", "title" => "R",
    "type" => %{"kind" => "record", "fields" => %{"name" => %{"kind" => "text"}, "note" => %{"kind" => "text"}}},
    "val" => %{"name" => "a", "note" => "one"}, "source" => %{"kind" => "local"}, "state" => "green",
    "names" => %{"name" => "Name", "note" => "Note"}}}
init_args = ~s([#{inspect(ws)}, #{:json.encode(%{"workspace" => workspace, "objects" => [object]})}])
patch = %{"kind" => "update", "ref" => %{"object" => "rec1", "path" => %{"steps" => [%{"key" => "name"}],
  "end" => %{"kind" => "val", "value" => %{"kind" => "text", "value" => "b"}}}}}
patch_args = IO.iodata_to_binary(:json.encode([ws, patch, %{"user" => "u1", "role" => "owner"}, %{"now" => 1_000_000}]))
init_args = IO.iodata_to_binary(init_args)

# Snapshot (snapshot mode only), created once and timed.
{snap, snap_line} =
  case mode do
    "baseline" -> {nil, ""}
    "snapshot" ->
      c0 = P.cpu_ms(pid)
      {us, {:ok, s}} = :timer.tc(fn -> JSEngine.create_snapshot("server-interop.min.js", code) end)
      c1 = P.cpu_ms(pid)
      info = JSEngine.snapshot_info(s)
      {s, "snapshot: #{info.size} B, create wall #{P.ms(us)} ms, create CPU #{c1 - c0} ms; "}
  end

start = fn ->
  case mode do
    "baseline" ->
      {:ok, i} = JSEngine.create_isolate(%{heap_mb: 256})
      :ok = JSEngine.load_source(i, "server-interop.min.js", code)
      i
    "snapshot" ->
      {:ok, i} = JSEngine.create_isolate(%{heap_mb: 256, snapshot: snap})
      i
  end
end

# Warm-up: platform init, page cache.
for _ <- 1..2, do: (i = start.(); {:ok, _} = JSEngine.call(i, "version", "[]", 30_000); JSEngine.destroy(i))

# 1. start (create + load, or create from snapshot) then `version`: per-sample CPU and wall.
samples =
  for _ <- 1..n do
    c0 = P.cpu_ms(pid)
    {us, i} = :timer.tc(fn -> i = start.(); {:ok, _} = JSEngine.call(i, "version", "[]", 30_000); i end)
    c1 = P.cpu_ms(pid)
    JSEngine.destroy(i)
    {c1 - c0, us}
  end
la1 = P.loadavg()

# Aggregate CPU over n starts (finer than the 10 ms per-sample resolution).
c0 = P.cpu_ms(pid)
isos = for _ <- 1..n, do: (i = start.(); {:ok, _} = JSEngine.call(i, "version", "[]", 30_000); i)
agg = (P.cpu_ms(pid) - c0) / n
Enum.each(isos, &JSEngine.destroy/1)

# 2. time to first apply: start, version, init the workspace, first patch.
tfa =
  for _ <- 1..n do
    c0 = P.cpu_ms(pid)
    {us, {i, out}} = :timer.tc(fn ->
      i = start.()
      {:ok, _} = JSEngine.call(i, "version", "[]", 30_000)
      {:ok, "true"} = JSEngine.call(i, "init", init_args, 30_000)
      {:ok, out} = JSEngine.call(i, "patch", patch_args, 30_000)
      {i, out}
    end)
    c1 = P.cpu_ms(pid)
    JSEngine.destroy(i)
    {c1 - c0, us, out}
  end
outs = tfa |> Enum.map(&elem(&1, 2)) |> Enum.uniq()
la2 = P.loadavg()

# 3. memory: physical footprint delta over 20 started isolates, after `version`.
:erlang.garbage_collect()
f0 = P.footprint_kb(pid)
held = for _ <- 1..20, do: (i = start.(); {:ok, _} = JSEngine.call(i, "version", "[]", 30_000); i)
f1 = P.footprint_kb(pid)
Enum.each(held, &JSEngine.destroy/1)
la3 = P.loadavg()

IO.puts("""
[d54 #{mode}] bundle #{byte_size(code)} B, n=#{n}
  #{snap_line}
  start+version: CPU median #{P.med(Enum.map(samples, &elem(&1, 0)))} ms (per sample, 10 ms res), CPU aggregate #{Float.round(agg, 1)} ms/start, wall median #{P.ms(P.med(Enum.map(samples, &elem(&1, 1))))} ms, min #{P.ms(Enum.min(Enum.map(samples, &elem(&1, 1))))} ms  [loadavg #{la1}]
  first apply (start+version+init+patch): CPU median #{P.med(Enum.map(tfa, &elem(&1, 0)))} ms, wall median #{P.ms(P.med(Enum.map(tfa, &elem(&1, 1))))} ms, min #{P.ms(Enum.min(Enum.map(tfa, &elem(&1, 1))))} ms  [loadavg #{la2}]
  patch result distinct values: #{length(outs)}; sha256 #{Base.encode16(:crypto.hash(:sha256, hd(outs)), case: :lower) |> binary_part(0, 16)}
  memory: footprint +#{div(f1 - f0, 20)} KB per started isolate (20 held)  [loadavg #{la3}]
""")
File.write!(Path.join(System.get_env("D54_OUT", System.tmp_dir!()), "patch-#{mode}.json"), hd(outs))
