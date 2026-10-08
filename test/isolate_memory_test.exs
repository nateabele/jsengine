defmodule JSEngine.IsolateMemoryTest do
  # Not async: it measures the memory of the whole BEAM, so it must run after
  # the async tests, alone.
  use ExUnit.Case, async: false

  @bundle Path.expand("../bench/fixtures/elm-try.min.js", __DIR__)

  # The memory the process holds, in KB: the macOS physical footprint (the
  # memory the OS charges the process) less malloc's fragmentation (the dirty
  # malloc pages that hold no live allocation). RSS is the wrong measure:
  # libmalloc marks freed pages reusable (MADV_FREE) and they stay in RSS, so
  # RSS stays hundreds of MB high after a mass destroy although nothing is
  # live. The footprint alone is wrong too: libmalloc keeps freed regions
  # dirty, whole (`MALLOC_SMALL (empty)`, which grows about 4 MB a round up to
  # a cap near 50 MB) and partly used (one-off steps of up to 20 MB), so it
  # rose by 11 to 35 MB over the two rounds below with no leak, more under
  # load. Without the fragmentation the same runs moved by -1 to +3 MB. Live
  # malloc allocations, V8 heaps (VM_ALLOCATE) and thread stacks all stay in
  # the measure. It is less sensitive to page pinning: a small live block
  # kept per isolate also keeps its dirty page, but only the block counts
  # (the rest of the page is fragmentation).
  defp live_kb do
    {out, 0} = System.cmd("vmmap", ["--summary", System.pid()], stderr_to_stdout: true)
    [_, footprint] = Regex.run(~r/Physical footprint:\s+(\S+)/, out) || flunk("vmmap: no Physical footprint line:\n#{out}")

    # vmmap prints one decimal: in G that is about 100 MB, too coarse for the
    # 12 MB budget.
    assert String.ends_with?(footprint, ["K", "M"]), "vmmap: footprint #{footprint} is not in K or M"

    # The MALLOC ZONE table: the column header is the line above "MALLOC
    # ZONE", the rows follow its "=====" line up to a blank line or the
    # "=====" above TOTAL. A zone name may hold spaces, so a row's values are
    # counted from its end: one per header column, plus "% FRAG" before
    # REGION COUNT.
    [_, header, rows] =
      Regex.run(~r/^(.*)\nMALLOC ZONE.*\n=+.*\n((?:(?!=)\S.*\n)+)/m, out) ||
        flunk("vmmap: no MALLOC ZONE table:\n#{out}")

    columns = String.split(header)

    assert columns == ~w(VIRTUAL RESIDENT DIRTY SWAPPED ALLOCATION BYTES DIRTY+SWAP REGION),
           "vmmap: unexpected MALLOC ZONE columns #{inspect(columns)}"

    frag_at = Enum.find_index(columns, &(&1 == "DIRTY+SWAP"))

    frag =
      rows
      |> String.split("\n", trim: true)
      |> Enum.map(fn row -> row |> String.split() |> Enum.take(-(length(columns) + 1)) |> Enum.at(frag_at) |> kb() end)
      |> Enum.sum()

    # A parse that stopped early would under-subtract and read as growth.
    assert frag > 0 and frag < kb(footprint), "vmmap: fragmentation #{frag} KB of footprint #{footprint}:\n#{out}"

    %{footprint: kb(footprint), frag: frag, live: kb(footprint) - frag}
  end

  # A vmmap size ("824", "176K", "71.0M") in KB; vmmap prints a bare number in bytes.
  defp kb(size) do
    case Regex.run(~r/^([0-9.]+)([BKMGT]?)$/, size || "") do
      [_, n, unit] ->
        scale = %{"" => 1 / 1024, "B" => 1 / 1024, "K" => 1, "M" => 1024, "G" => 1_048_576, "T" => 1_073_741_824}[unit]
        round(elem(Float.parse(n), 0) * scale)

      nil ->
        raise ArgumentError, "vmmap: unknown size #{inspect(size)}"
    end
  end

  defp create_loaded(count, code) do
    1..count
    |> Task.async_stream(
      fn _ ->
        {:ok, isolate} = JSEngine.create_isolate(%{heap_mb: 64})
        :ok = JSEngine.load_source(isolate, "elm-try.min.js", code)
        isolate
      end,
      max_concurrency: 16,
      timeout: 60_000
    )
    |> Enum.map(fn {:ok, isolate} -> isolate end)
  end

  @tag timeout: 180_000
  if :os.type() != {:unix, :darwin}, do: @tag(skip: "measures the macOS physical footprint")

  test "destroyed isolates give their memory back (no growth over rounds)" do
    code = File.read!(@bundle)
    # Warm-up round: allocator and V8 process-wide state reach their plateau.
    code |> then(&create_loaded(200, &1)) |> Enum.each(&JSEngine.destroy/1)
    Process.sleep(500)
    plateau = live_kb()

    for _ <- 1..2, do: code |> then(&create_loaded(200, &1)) |> Enum.each(&JSEngine.destroy/1)
    Process.sleep(500)
    after_kb = live_kb()

    # 400 more isolates, 12 MB: 30 KB per isolate. Anything per isolate in
    # jsengine (a kept thread, runtime or heap) is hundreds of KB each and
    # fails: controls that kept 1 KB malloc blocks per isolate measured +43 MB
    # for 100 KB and +19 MB for 40 KB. A clean run moves -1 to +3 MB: live
    # malloc grows about 8 KB per isolate on master (3.4 MB here; deno_core
    # 0.230 leaks about 4.5 KB per runtime, the rest is unattributed), and
    # VM_ALLOCATE (mostly V8's mappings) shrinks by 1 to 3 MB, which hides as
    # much growth. Detection floor, on top of that 8 KB baseline: reliably
    # about 40 KB per isolate; a 25 KB leak (+12.5 MB in one run) fails only
    # when the baseline lands high, and a smaller one passes.
    assert after_kb.live - plateau.live <= 12 * 1024,
           "KB, footprint less malloc fragmentation: plateau #{inspect(plateau)}, after 400 more isolates #{inspect(after_kb)}"
  end

  @tag timeout: 60_000
  if :os.type() != {:unix, :darwin}, do: @tag(skip: "measures the macOS physical footprint")

  test "a low-memory notification returns a worked isolate's garbage to the OS" do
    {:ok, isolate} = JSEngine.create_isolate(%{heap_mb: 512})
    on_exit(fn -> JSEngine.destroy(isolate) end)

    :ok =
      JSEngine.load_source(
        isolate,
        "churn.js",
        "globalThis.fill = () => { globalThis.hold = []; for (let i = 0; i < 800; i++) hold.push(new Array(25000).fill(i + 0.5)); return hold.length; };" <>
          " globalThis.release = () => { globalThis.hold = null; return 0; };"
      )

    # 160 MB of arrays, made and dropped: V8 keeps them until a major GC.
    assert {:ok, "800"} = JSEngine.call(isolate, "fill", "[]", 30_000)
    assert {:ok, "0"} = JSEngine.call(isolate, "release", "[]", 1_000)
    before = live_kb()
    assert :ok = JSEngine.low_memory_notification(isolate)
    after_kb = live_kb()

    assert before.footprint - after_kb.footprint >= 100 * 1024,
           "KB: before #{inspect(before)}, after #{inspect(after_kb)}"
  end
end
