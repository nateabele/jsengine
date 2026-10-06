defmodule JSEngine.SnapshotTest do
  # Not async: `snapshot_for/3` keeps its snapshots in :persistent_term.
  use ExUnit.Case, async: false

  # A bundle with top-level state: a table built at load, a load counter and a mutable global.
  @bundle """
  var table = []; for (var i = 0; i < 1000; i++) table.push(i * i);
  var loads = (globalThis.loads || 0) + 1; globalThis.loads = loads;
  var counter = 0;
  globalThis.sum = () => table.reduce((a, b) => a + b, 0);
  globalThis.bump = () => ++counter;
  globalThis.state = () => ({ loads, counter, stray: globalThis.stray ?? null });
  globalThis.taint = (v) => { globalThis.stray = v; return v; };
  globalThis.later = (v) => new Promise((r) => setTimeout(() => r(v), 5));
  """

  defp isolate!(opts) do
    {:ok, isolate} = JSEngine.create_isolate(Map.merge(%{heap_mb: 64}, opts))
    on_exit(fn -> JSEngine.destroy(isolate) end)
    isolate
  end

  defp snapshot!(code \\ @bundle) do
    {:ok, snapshot} = JSEngine.create_snapshot("bundle.js", code)
    snapshot
  end

  defp calls(isolate) do
    for {fun, args} <- [{"sum", "[]"}, {"bump", "[]"}, {"bump", "[]"}, {"state", "[]"}, {"later", "[7]"}],
        do: JSEngine.call(isolate, fun, args, 5_000)
  end

  test "an isolate from a snapshot answers like one that loaded the bundle" do
    loaded = isolate!(%{})
    :ok = JSEngine.load_source(loaded, "bundle.js", @bundle)
    started = isolate!(%{snapshot: snapshot!()})

    assert calls(started) == calls(loaded)
    assert {:ok, ~s({"loads":1,"counter":2,"stray":null})} = JSEngine.call(started, "state", "[]", 5_000)
  end

  test "a snapshot round trips through a binary" do
    snapshot = snapshot!()
    {:ok, binary} = JSEngine.snapshot_to_binary(snapshot)
    {:ok, back} = JSEngine.snapshot_from_binary(binary)

    assert JSEngine.snapshot_info(back) == JSEngine.snapshot_info(snapshot)
    assert JSEngine.snapshot_info(back).bundle_sha256 == Base.encode16(:crypto.hash(:sha256, @bundle), case: :lower)
    assert {:ok, "332833500"} = JSEngine.call(isolate!(%{snapshot: back}), "sum", "[]", 5_000)
  end

  test "a binary of another build, or a damaged one, is refused before V8 reads it" do
    {:ok, binary} = JSEngine.snapshot_to_binary(snapshot!())
    # Byte 12 is the first byte of the build id.
    <<head::binary-size(12), b, rest::binary>> = binary
    assert {:error, :stale} = JSEngine.snapshot_from_binary(<<head::binary, Bitwise.bxor(b, 1), rest::binary>>)

    size = byte_size(binary) - 1
    <<body::binary-size(^size), last>> = binary
    assert {:error, :corrupt} = JSEngine.snapshot_from_binary(<<body::binary, Bitwise.bxor(last, 1)>>)
    assert {:error, :corrupt} = JSEngine.snapshot_from_binary(body)
    assert {:error, :corrupt} = JSEngine.snapshot_from_binary("not a snapshot")
  end

  test "snapshot_for/3 makes a snapshot once per bundle hash and a new one when the bundle changes" do
    name = "bundle-#{System.unique_integer([:positive])}.js"
    on_exit(fn -> JSEngine.forget_snapshot(name) end)

    {:ok, a} = JSEngine.snapshot_for(name, @bundle)
    assert {:ok, ^a} = JSEngine.snapshot_for(name, @bundle)

    changed = @bundle <> "\nglobalThis.extra = () => 'new';"
    {:ok, b} = JSEngine.snapshot_for(name, changed)
    refute b == a
    assert JSEngine.snapshot_info(b).bundle_sha256 == Base.encode16(:crypto.hash(:sha256, changed), case: :lower)
    assert {:ok, ^b} = JSEngine.snapshot_for(name, changed)

    assert {:ok, ~s("new")} = JSEngine.call(isolate!(%{snapshot: b}), "extra", "[]", 5_000)
    assert {:error, {:js, _}} = JSEngine.call(isolate!(%{snapshot: a}), "extra", "[]", 5_000)
  end

  test "isolates started from one snapshot share no state" do
    snapshot = snapshot!()
    a = isolate!(%{snapshot: snapshot})
    assert {:ok, "1"} = JSEngine.call(a, "bump", "[]", 5_000)
    assert {:ok, ~s("from a")} = JSEngine.call(a, "taint", ~s(["from a"]), 5_000)

    b = isolate!(%{snapshot: snapshot})
    assert {:ok, ~s({"loads":1,"counter":0,"stray":null})} = JSEngine.call(b, "state", "[]", 5_000)
    assert {:ok, ~s({"loads":1,"counter":1,"stray":"from a"})} = JSEngine.call(a, "state", "[]", 5_000)

    # A fatal failure in one does not touch the other or the snapshot.
    :ok = JSEngine.load_source(b, "spin.js", "globalThis.spin = () => { for (;;) {} };")
    assert {:error, :timeout} = JSEngine.call(b, "spin", "[]", 200)
    assert {:ok, "2"} = JSEngine.call(a, "bump", "[]", 5_000)
    assert {:ok, "1"} = JSEngine.call(isolate!(%{snapshot: snapshot}), "bump", "[]", 5_000)
  end

  test "a bundle that throws, leaves a timer pending or spins is refused" do
    assert {:error, {:js, msg}} = JSEngine.create_snapshot("bad.js", "throw new Error('at load');")
    assert msg =~ "at load"
    assert {:error, {:js, msg}} = JSEngine.create_snapshot("timer.js", "setTimeout(() => {}, 0);")
    assert msg =~ "pending"
    assert {:error, :timeout} = JSEngine.create_snapshot("spin.js", "for (;;) {}", %{timeout_ms: 200})
  end

  test "a bundle that allocates without bound at load is {:error, :oom}, and the BEAM lives on" do
    hog = "const hoard = []; for (;;) hoard.push(new Array(100000).fill(1.5));"
    assert {:error, :oom} = JSEngine.create_snapshot("hog.js", hog, %{heap_mb: 64})
    assert {:ok, "332833500"} = JSEngine.call(isolate!(%{snapshot: snapshot!()}), "sum", "[]", 5_000)
  end

  test "snapshot_for/3 remembers a failure until the bundle changes" do
    name = "failing-#{System.unique_integer([:positive])}.js"
    on_exit(fn -> JSEngine.forget_snapshot(name) end)
    spin = "for (;;) {}"

    {first_us, first} = :timer.tc(fn -> JSEngine.snapshot_for(name, spin, %{timeout_ms: 300}) end)
    assert first == {:error, :timeout}
    assert first_us >= 300_000

    # Not tried again: the same error at once.
    {again_us, again} = :timer.tc(fn -> JSEngine.snapshot_for(name, spin, %{timeout_ms: 300}) end)
    assert again == {:error, :timeout}
    assert again_us < 100_000, "retried: #{again_us} us"

    # A changed bundle is a new key and is tried.
    assert {:ok, _} = JSEngine.snapshot_for(name, @bundle)
    # forget_snapshot/1 clears the entry, so the failure is tried again.
    JSEngine.forget_snapshot(name)
    {retry_us, {:error, :timeout}} = :timer.tc(fn -> JSEngine.snapshot_for(name, spin, %{timeout_ms: 300}) end)
    assert retry_us >= 300_000
  end

  test "concurrent first calls to snapshot_for/3 make one snapshot" do
    name = "race-#{System.unique_integer([:positive])}.js"
    on_exit(fn -> JSEngine.forget_snapshot(name) end)

    results =
      1..8
      |> Task.async_stream(fn _ -> JSEngine.snapshot_for(name, @bundle) end, max_concurrency: 8, timeout: 30_000)
      |> Enum.map(fn {:ok, {:ok, snapshot}} -> snapshot end)

    assert length(Enum.uniq(results)) == 1
  end

  test "create_isolate/1 refuses a snapshot option that is not a snapshot, or a heap too small for it" do
    assert {:error, :badarg} = JSEngine.create_isolate(%{snapshot: nil})
    assert {:error, :badarg} = JSEngine.create_isolate(%{snapshot: "bundle"})
    assert {:error, :badarg} = JSEngine.create_isolate(%{snapshot: make_ref()})

    {:ok, big} = JSEngine.create_snapshot("big.js", "globalThis.big = Array.from({ length: 2000000 }, (_, i) => i);")
    assert JSEngine.snapshot_info(big).size * 4 > 16 * 1024 * 1024
    assert {:error, :oom} = JSEngine.create_isolate(%{heap_mb: 16, snapshot: big})
  end

  # THE GUARD FOR THE PREDICTABLE-MODE TRAP (the Rust Math.random check is not one: another test
  # may have initialised V8 first). The first runtime of a process initialises V8. A snapshotting
  # runtime would do it with `--predictable --random-seed=42`, for every isolate of the BEAM (the
  # same Math.random sequence everywhere). Needs a fresh OS process, where the snapshot is the
  # first runtime.
  @tag timeout: 120_000
  test "a snapshot made before any isolate leaves V8 in its normal mode" do
    script = """
    {:ok, s} = JSEngine.create_snapshot("r.js", "globalThis.r = () => Math.random();")
    rs = for _ <- 1..3 do
      {:ok, i} = JSEngine.create_isolate(%{snapshot: s})
      {:ok, r} = JSEngine.call(i, "r", "[]", 5000)
      r
    end
    IO.write(Enum.join(rs, " "))
    """

    {out, 0} = System.cmd("elixir", ["-pa", Path.join(Mix.Project.app_path(), "ebin"), "-e", script])
    randoms = out |> String.split("\n") |> List.last() |> String.split(" ")
    assert length(randoms) == 3
    assert length(Enum.uniq(randoms)) == 3, "the same Math.random in every isolate: #{out}"
  end
end
