defmodule JSEngine.IsolateMemoryTest do
  # Not async: it measures the memory of the whole BEAM, so it must run after
  # the async tests, alone.
  use ExUnit.Case, async: false

  @bundle Path.expand("../bench/fixtures/elm-try.min.js", __DIR__)

  # macOS physical footprint, the memory the OS charges the process. RSS is
  # the wrong measure here: libmalloc marks freed pages reusable (MADV_FREE)
  # and they stay in RSS until the kernel needs them, so RSS stays hundreds
  # of MB high after a mass destroy although nothing is live.
  defp footprint_kb do
    {out, 0} = System.cmd("vmmap", ["--summary", System.pid()], stderr_to_stdout: true)
    [_, n, unit] = Regex.run(~r/Physical footprint:\s+([0-9.]+)([KMG])/, out)
    round(elem(Float.parse(n), 0) * %{"K" => 1, "M" => 1024, "G" => 1_048_576}[unit])
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
    plateau = footprint_kb()

    for _ <- 1..2, do: code |> then(&create_loaded(200, &1)) |> Enum.each(&JSEngine.destroy/1)
    Process.sleep(500)
    after_kb = footprint_kb()

    # 400 more isolates. deno_core 0.230 itself leaks about 4.5 KB per
    # runtime (about 2 MB here); anything per isolate in jsengine (a kept
    # thread, runtime or heap) would be hundreds of KB each.
    assert after_kb - plateau <= 12 * 1024,
           "footprint KB: plateau #{plateau}, after 400 more isolates #{after_kb}"
  end
end
