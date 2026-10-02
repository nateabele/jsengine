# Replays the F2 jsengine analysis measurements.
#
#   mix run bench/bench.exs legacy  [out.tsv]   # create_env/load/call (one engine thread)
#   mix run bench/bench.exs isolate [out.tsv]   # create_isolate/load_source/call (thread per isolate)
#
# Prints one `metric<TAB>value<TAB>unit` line per measurement and, when an
# output path is given, writes the same lines to it. The workload is the
# `try` Elm worker (bench/fixtures/elm-try.js) with the orders tables.

defmodule Bench do
  @fixtures Path.expand("fixtures", __DIR__)

  def fixture(name), do: Path.join(@fixtures, name)
  def read(name), do: File.read!(fixture(name))

  def ms(us), do: Float.round(us / 1000, 2)

  def rss_kb do
    :os.cmd(~c"ps -o rss= -p #{System.pid()}") |> to_string() |> String.trim() |> String.to_integer()
  end

  def emit(rows, metric, value, unit) do
    line = "#{metric}\t#{value}\t#{unit}"
    IO.puts(line)
    [line | rows]
  end

  def time(fun) do
    {us, result} = :timer.tc(fun)
    {ms(us), result}
  end
end

defmodule Bench.Legacy do
  import Bench

  def ok!({:ok, value}), do: value
  def ok!(other), do: raise("unexpected #{inspect(other, limit: 5, printable_limit: 200)}")

  def loaded(env) do
    ok!(JSEngine.load(env, [fixture("elm-try.js"), fixture("shim.js")]))
    ok!(JSEngine.call(env, "tryInit", []))
    env
  end

  def run(rows) do
    {t, _} = time(fn -> JSEngine.run(:default, "1+1") end)
    rows = emit(rows, "first_call", t, "ms")
    {t, {:ok, env}} = time(fn -> JSEngine.create_env() end)
    rows = emit(rows, "create", t, "ms")
    {t, r} = time(fn -> JSEngine.load(env, [fixture("elm-try.js")]) end)
    ok!(r)
    rows = emit(rows, "load_unminified_653k", t, "ms")
    {:ok, env_min} = JSEngine.create_env()
    {t, r} = time(fn -> JSEngine.load(env_min, [fixture("elm-try.min.js")]) end)
    ok!(r)
    rows = emit(rows, "load_minified_175k", t, "ms")
    ok!(JSEngine.load(env, [fixture("shim.js")]))
    {t, _} = time(fn -> ok!(JSEngine.call(env, "tryInit", [])) end)
    rows = emit(rows, "elm_init", t, "ms")
    ok!(JSEngine.call(env, "tryLoad", ["orders", read("orders.json"), read("orders.type.json")]))
    ok!(JSEngine.call(env, "tryNodes", [read("nodes.json")]))

    rows =
      Enum.reduce(["simple", "group", "coalesce"], rows, fn key, rows ->
        ok!(JSEngine.call(env, "tryRun", [key]))
        {us, _} = :timer.tc(fn -> for _ <- 1..200, do: ok!(JSEngine.call(env, "tryRun", [key])) end)
        emit(rows, "warm_check_6rows_#{key}", Float.round(us / 200 / 1000, 3), "ms")
      end)

    env2 = loaded(elem(JSEngine.create_env(), 1))
    {t, _} = time(fn -> ok!(JSEngine.call(env2, "tryLoad", ["orders", read("orders-5k.json"), read("orders.type.json")])) end)
    rows = emit(rows, "load_table_5000rows", t, "ms")
    ok!(JSEngine.call(env2, "tryNodes", [read("nodes.json")]))

    rows =
      Enum.reduce(["simple", "coalesce"], rows, fn key, rows ->
        ok!(JSEngine.call(env2, "tryRun", [key]))
        emit(rows, "warm_check_5k_#{key}", ok!(JSEngine.call(env2, "tryBench", [key, 20])), "ms")
      end)

    parent = self()

    spawn(fn ->
      {us, _} = :timer.tc(fn -> JSEngine.call(env2, "tryBench", ["coalesce", 20]) end)
      send(parent, {:slow, us})
    end)

    Process.sleep(20)
    {t, _} = time(fn -> JSEngine.run(env, "1") end)
    slow = receive do: ({:slow, us} -> ms(us))
    rows = emit(rows, "cross_isolate_wait", t, "ms")
    rows = emit(rows, "cross_isolate_slow_call", slow, "ms")

    r0 = rss_kb()
    envs = for _ <- 1..10, do: loaded(elem(JSEngine.create_env(), 1))
    rows = emit(rows, "rss_per_loaded_isolate", div(rss_kb() - r0, 10), "KB")
    # No destroy_env here: on the legacy engine, create_env after destroy_env
    # segfaults the BEAM (isolates dropped out of order on one thread).
    _ = envs

    # Last: this wedges the single engine thread for good.
    {:ok, a} = JSEngine.create_env()
    {:ok, b} = JSEngine.create_env()
    spawn(fn -> JSEngine.run(a, "while(true){}") end)
    Process.sleep(200)
    task = Task.async(fn -> JSEngine.run(b, "1+1") end)

    case Task.yield(task, 3000) do
      nil -> emit(rows, "spin_other_isolate_call", ">3000 (blocked)", "ms")
      {:ok, _} -> emit(rows, "spin_other_isolate_call", "returned", "")
    end
  end
end

{mode, out} =
  case System.argv() do
    [mode] -> {mode, nil}
    [mode, out] -> {mode, out}
    _ -> raise "usage: mix run bench/bench.exs legacy [out.tsv]"
  end

rows =
  case mode do
    "legacy" -> Bench.Legacy.run([])
  end

if out, do: File.write!(out, rows |> Enum.reverse() |> Enum.join("\n") |> Kernel.<>("\n"))
System.halt(0)
