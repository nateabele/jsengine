defmodule JSEngine.IsolateTest do
  use ExUnit.Case, async: true

  defp isolate!(opts \\ %{heap_mb: 64}) do
    {:ok, isolate} = JSEngine.create_isolate(opts)
    on_exit(fn -> JSEngine.destroy(isolate) end)
    isolate
  end

  describe "create_isolate/1, load_source/3 and call/4" do
    test "loads source and calls a function with JSON in and out" do
      isolate = isolate!()
      assert :ok = JSEngine.load_source(isolate, "add.js", "globalThis.add = (a, b) => a + b;")
      assert {:ok, "3"} = JSEngine.call(isolate, "add", "[1, 2]", 1_000)
    end

    test "uses a 256 MB heap when no limit is given" do
      isolate = isolate!(%{})
      assert :ok = JSEngine.load_source(isolate, "one.js", "globalThis.one = () => 1;")
      assert {:ok, "1"} = JSEngine.call(isolate, "one", "[]", 1_000)
    end

    test "awaits promises and setTimeout" do
      isolate = isolate!()

      :ok =
        JSEngine.load_source(
          isolate,
          "later.js",
          "globalThis.later = (v) => new Promise((r) => setTimeout(() => r({v}), 10));"
        )

      assert {:ok, ~s({"v":"x"})} = JSEngine.call(isolate, "later", ~s(["x"]), 1_000)
    end

    test "a JavaScript error is {:js, msg} and the isolate stays usable" do
      isolate = isolate!()

      :ok =
        JSEngine.load_source(
          isolate,
          "boom.js",
          "globalThis.boom = () => { throw new Error('nope'); }; globalThis.one = () => 1;"
        )

      assert {:error, {:js, message}} = JSEngine.call(isolate, "boom", "[]", 1_000)
      assert message =~ "nope"
      assert {:error, {:js, _}} = JSEngine.call(isolate, "missing", "[]", 1_000)
      assert {:error, {:js, "args_json must be a JSON array"}} = JSEngine.call(isolate, "one", "{}", 1_000)
      assert JSEngine.alive?(isolate)
      assert {:ok, "1"} = JSEngine.call(isolate, "one", "[]", 1_000)
    end

    test "a load that calls setTimeout at top level works (and does not abort the BEAM)" do
      isolate = isolate!()

      code =
        "globalThis.fired = false; setTimeout(() => { globalThis.fired = true; }, 0);" <>
          " globalThis.settle = () => new Promise((r) => setTimeout(() => r(fired), 20));"

      assert :ok = JSEngine.load_source(isolate, "timer.js", code)
      assert {:ok, "true"} = JSEngine.call(isolate, "settle", "[]", 1_000)
    end

    test "a huge timeout is clamped instead of overflowing" do
      isolate = isolate!()
      huge = Integer.pow(10, 30)
      assert :ok = JSEngine.load_source(isolate, "one.js", "globalThis.one = () => 1;", huge)
      assert {:ok, "1"} = JSEngine.call(isolate, "one", "[]", huge)
      assert {:ok, "1"} = JSEngine.call(isolate, "one", "[]", 0xFFFF_FFFF_FFFF_FFFF)
    end

    test "a syntax error in loaded source is {:js, msg}" do
      isolate = isolate!()
      assert {:error, {:js, _}} = JSEngine.load_source(isolate, "bad.js", "this is not }{ javascript")
      assert JSEngine.alive?(isolate)
    end

    test "source is never treated as TypeScript or as an ES module" do
      isolate = isolate!()

      code =
        "var f = 1, g = 2, h = 0; var marker = '): export import ';" <>
          " globalThis.probe = () => (f < g > (h));"

      assert :ok = JSEngine.load_source(isolate, "probe.min.js", code)
      assert {:ok, "true"} = JSEngine.call(isolate, "probe", "[]", 1_000)
    end
  end

  describe "host failures" do
    test "while(true) times out, discards the isolate, and leaves others usable" do
      a = isolate!()
      b = isolate!()
      :ok = JSEngine.load_source(a, "spin.js", "globalThis.spin = () => { while (true) {} };")
      :ok = JSEngine.load_source(b, "one.js", "globalThis.one = () => 1;")

      {elapsed_us, result} = :timer.tc(fn -> JSEngine.call(a, "spin", "[]", 300) end)
      assert result == {:error, :timeout}
      assert elapsed_us < 3_000_000
      refute JSEngine.alive?(a)
      assert {:error, :dead} = JSEngine.call(a, "spin", "[]", 1_000)
      assert {:ok, "1"} = JSEngine.call(b, "one", "[]", 1_000)
    end

    test "an idle wait past the deadline times out" do
      isolate = isolate!()

      :ok =
        JSEngine.load_source(
          isolate,
          "wait.js",
          "globalThis.wait = () => new Promise((r) => setTimeout(r, 60000));"
        )

      assert {:error, :timeout} = JSEngine.call(isolate, "wait", "[]", 200)
    end

    test "a load that never finishes times out" do
      isolate = isolate!()
      assert {:error, :timeout} = JSEngine.load_source(isolate, "spin.js", "while (true) {}", 200)
    end

    test "heap exhaustion returns :oom and the BEAM survives" do
      isolate = isolate!(%{heap_mb: 64})

      :ok =
        JSEngine.load_source(
          isolate,
          "hog.js",
          "globalThis.hog = () => { const a = []; for (;;) a.push(new Array(100000).fill(1.5)); };"
        )

      assert {:error, :oom} = JSEngine.call(isolate, "hog", "[]", 30_000)
      refute JSEngine.alive?(isolate)
      other = isolate!()
      :ok = JSEngine.load_source(other, "one.js", "globalThis.one = () => 1;")
      assert {:ok, "1"} = JSEngine.call(other, "one", "[]", 1_000)
    end

    test "a panic on the isolate thread is {:panic, msg}, and a new isolate works" do
      isolate = isolate!()

      assert {:error, {:panic, "jsengine test hook: deliberate panic"}} =
               JSEngine.__test_panic__(isolate)

      refute JSEngine.alive?(isolate)
      assert {:error, :dead} = JSEngine.call(isolate, "anything", "[]", 1_000)
      fresh = isolate!()
      :ok = JSEngine.load_source(fresh, "one.js", "globalThis.one = () => 1;")
      assert {:ok, "1"} = JSEngine.call(fresh, "one", "[]", 1_000)
    end

    test "destroy/1 discards the isolate" do
      isolate = isolate!()
      assert :ok = JSEngine.destroy(isolate)
      refute JSEngine.alive?(isolate)
      assert {:error, :dead} = JSEngine.call(isolate, "one", "[]", 1_000)
      assert {:error, :dead} = JSEngine.load_source(isolate, "x.js", "1")
    end
  end

  describe "isolation" do
    test "a slow call in one isolate does not delay a call in another" do
      a = isolate!()
      b = isolate!()

      :ok =
        JSEngine.load_source(
          a,
          "busy.js",
          "globalThis.busy = (ms) => { const end = Date.now() + ms; while (Date.now() < end) {} return ms; };"
        )

      :ok = JSEngine.load_source(b, "one.js", "globalThis.one = () => 1;")
      slow = Task.async(fn -> JSEngine.call(a, "busy", "[700]", 5_000) end)
      Process.sleep(50)
      {elapsed_us, result} = :timer.tc(fn -> JSEngine.call(b, "one", "[]", 1_000) end)
      assert result == {:ok, "1"}
      assert elapsed_us < 100_000, "call on B waited #{div(elapsed_us, 1000)} ms"
      assert {:ok, "700"} = Task.await(slow)
    end

    test "isolates can be created after others are destroyed, in any order" do
      first = for _ <- 1..3, do: isolate!()
      Enum.each(first, &JSEngine.destroy/1)
      again = isolate!()
      :ok = JSEngine.load_source(again, "one.js", "globalThis.one = () => 1;")
      assert {:ok, "1"} = JSEngine.call(again, "one", "[]", 1_000)
    end

    test "globals do not leak between isolates" do
      a = isolate!()
      b = isolate!()
      :ok = JSEngine.load_source(a, "a.js", "globalThis.who = () => 'a';")
      assert {:error, {:js, _}} = JSEngine.call(b, "who", "[]", 1_000)
    end
  end

  describe "low_memory_notification/2" do
    @churn """
    globalThis.fill = () => { globalThis.hold = []; for (let i = 0; i < 200; i++) hold.push(new Array(25000).fill(i + 0.5)); return hold.length; };
    globalThis.release = () => { globalThis.hold = null; return 0; };
    globalThis.held = () => (globalThis.hold ? hold.length : 0);
    globalThis.wait = (ms) => new Promise((r) => setTimeout(() => r(ms), ms));
    """

    test "is :ok on a worked isolate, which keeps its state" do
      isolate = isolate!(%{heap_mb: 256})
      :ok = JSEngine.load_source(isolate, "churn.js", @churn)
      assert {:ok, "200"} = JSEngine.call(isolate, "fill", "[]", 5_000)
      assert :ok = JSEngine.low_memory_notification(isolate)
      assert {:ok, "200"} = JSEngine.call(isolate, "held", "[]", 1_000)
      assert {:ok, "0"} = JSEngine.call(isolate, "release", "[]", 1_000)
      assert :ok = JSEngine.low_memory_notification(isolate)
      assert JSEngine.alive?(isolate)
    end

    test "is a fast no-op on a fresh isolate" do
      isolate = isolate!()
      {us, result} = :timer.tc(fn -> JSEngine.low_memory_notification(isolate) end)
      assert result == :ok
      # About 2 ms measured; the bound only catches a pathological cost.
      assert us < 250_000, "took #{div(us, 1000)} ms"
    end

    test "is {:error, :dead} on a destroyed or retired isolate" do
      destroyed = isolate!()
      :ok = JSEngine.destroy(destroyed)
      assert {:error, :dead} = JSEngine.low_memory_notification(destroyed)

      retired = isolate!()
      :ok = JSEngine.load_source(retired, "spin.js", "globalThis.spin = () => { while (true) {} };")
      assert {:error, :timeout} = JSEngine.call(retired, "spin", "[]", 100)
      assert {:error, :dead} = JSEngine.low_memory_notification(retired)
    end

    test "waits behind a call in flight, and a call sent during it answers normally" do
      isolate = isolate!(%{heap_mb: 256})
      :ok = JSEngine.load_source(isolate, "churn.js", @churn)
      assert {:ok, "200"} = JSEngine.call(isolate, "fill", "[]", 5_000)
      t0 = System.monotonic_time(:millisecond)
      slow = Task.async(fn -> {JSEngine.call(isolate, "wait", "[300]", 5_000), System.monotonic_time(:millisecond)} end)
      Process.sleep(50)
      gc = Task.async(fn -> {JSEngine.low_memory_notification(isolate), System.monotonic_time(:millisecond)} end)
      Process.sleep(20)
      during = Task.async(fn -> {JSEngine.call(isolate, "held", "[]", 5_000), System.monotonic_time(:millisecond)} end)
      {slow_result, slow_at} = Task.await(slow)
      {gc_result, gc_at} = Task.await(gc)
      {during_result, during_at} = Task.await(during)
      assert slow_result == {:ok, "300"}
      assert gc_result == :ok
      assert during_result == {:ok, "200"}
      assert gc_at - t0 >= 300 and gc_at >= slow_at, "the notification did not wait for the call in flight"
      assert during_at >= gc_at
    end

    test "works on an isolate started from a snapshot" do
      {:ok, snapshot} = JSEngine.create_snapshot("churn.js", @churn)
      isolate = isolate!(%{heap_mb: 256, snapshot: snapshot})
      assert {:ok, "200"} = JSEngine.call(isolate, "fill", "[]", 5_000)
      assert {:ok, "0"} = JSEngine.call(isolate, "release", "[]", 1_000)
      assert :ok = JSEngine.low_memory_notification(isolate)
      assert {:ok, "50"} = JSEngine.call(isolate, "wait", "[50]", 1_000)
    end

    test "__test_low_memory__/1 keeps its old reply" do
      isolate = isolate!()
      assert {:ok, "null"} = JSEngine.__test_low_memory__(isolate)
    end
  end
end
