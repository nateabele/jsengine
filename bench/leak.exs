# Isolate memory over many create/load/destroy cycles.
#
#   mix run bench/leak.exs seq  N  (bundle PATH | empty)   # one isolate at a time
#   mix run bench/leak.exs conc K ROUNDS (bundle PATH | empty)  # K live at once, then destroy all
#
# Prints `label<TAB>rss_kb<TAB>footprint_kb<TAB>threads` lines. A real leak grows with the
# number of cycles; retained-but-reusable memory reaches a plateau that a
# second round does not raise.

defmodule Leak do
  # Under MallocStackLogging=1 every child shell prints notices; drop them.
  def sh(cmd) do
    :os.cmd(String.to_charlist("env -u MallocStackLogging " <> cmd))
    |> to_string()
    |> String.split("\n")
    |> Enum.reject(&String.contains?(&1, "MallocStackLogging"))
    |> Enum.join("\n")
  end

  def rss_kb do
    sh("ps -o rss= -p #{System.pid()}") |> String.trim() |> String.to_integer()
  end

  # macOS physical footprint (what jetsam and Activity Monitor charge). Unlike
  # RSS it excludes pages that libmalloc has already marked reusable
  # (MADV_FREE): those stay resident until the kernel needs them.
  def footprint_kb do
    case Regex.run(~r/Physical footprint:\s+([0-9.]+)([KMG])/, sh("vmmap --summary #{System.pid()} 2>/dev/null")) do
      [_, n, unit] -> round(elem(Float.parse(n), 0) * %{"K" => 1, "M" => 1024, "G" => 1_048_576}[unit])
      _ -> -1
    end
  end

  # macOS: `ps -M` prints one line per thread plus a header.
  def threads do
    sh("ps -M -p #{System.pid()}") |> String.split("\n", trim: true) |> length() |> Kernel.-(1)
  end

  def sample(label) do
    :erlang.garbage_collect()
    Process.sleep(300)
    IO.puts("#{label}\t#{rss_kb()}\t#{footprint_kb()}\t#{threads()}\t#{regions()}")
  end

  # macOS: where the resident memory is, from `vmmap --summary` (LEAK_VMMAP=1):
  # malloc zones (resident, live bytes, free-but-kept "frag"), V8's own mmap
  # regions (VM_ALLOCATE) and thread stacks, in MB.
  def regions do
    if System.get_env("LEAK_VMMAP") == "1" do
      lines = sh("vmmap --summary #{System.pid()} 2>/dev/null") |> String.split("\n")
      resident = fn prefix -> lines |> Enum.filter(&String.starts_with?(&1, prefix)) |> Enum.map(&col(&1, prefix, 1)) |> Enum.sum() end
      zones = Enum.filter(lines, &Regex.match?(~r/^[A-Za-z]+Zone_0x/, &1))
      zone = fn i -> zones |> Enum.map(&(&1 |> String.split() |> Enum.at(i) |> mb())) |> Enum.sum() end

      "malloc_res=#{r(resident.("MALLOC_"))} malloc_live=#{r(zone.(6))} malloc_frag=#{r(zone.(7))}" <>
        " vm_allocate=#{r(resident.("VM_ALLOCATE "))} stack=#{r(resident.("Stack "))}"
    else
      ""
    end
  end

  # Column `i` after the region name (0 = virtual, 1 = resident).
  defp col(line, prefix, i) do
    name_words = prefix |> String.split() |> length()
    rest = line |> String.split() |> Enum.drop(name_words)
    # Region names can have a second word ("MALLOC_NANO metadata").
    rest = if Regex.match?(~r/^[0-9.]+[KMG]?$/, hd(rest)), do: rest, else: tl(rest)
    rest |> Enum.at(i) |> mb()
  end

  defp mb(text) do
    case Regex.run(~r/^([0-9.]+)([KMG]?)$/, text || "") do
      [_, n, unit] ->
        {v, _} = Float.parse(n)
        v * %{"" => 1 / 1_048_576, "K" => 1 / 1024, "M" => 1, "G" => 1024}[unit]

      _ ->
        0.0
    end
  end

  defp r(v), do: Float.round(v, 1)

  def code(["bundle", path]), do: File.read!(path)
  def code(["empty"]), do: "globalThis.version = () => 'empty';"

  def cycle(code) do
    {:ok, iso} = JSEngine.create_isolate(%{heap_mb: 256})
    :ok = JSEngine.load_source(iso, "bundle.min.js", code)
    {:ok, _} = JSEngine.call(iso, "version", "[]", 5_000)
    iso
  end

  def seq(n, code) do
    sample("seq start")
    step = max(div(n, 10), 1)

    for i <- 1..n do
      iso = cycle(code)
      :ok = JSEngine.destroy(iso)
      if rem(i, step) == 0, do: sample("seq #{i}")
    end
  end

  def conc(k, rounds, code) do
    sample("conc start")

    for r <- 1..rounds do
      isos =
        1..k
        |> Task.async_stream(fn _ -> cycle(code) end, max_concurrency: 32, timeout: 60_000)
        |> Enum.map(fn {:ok, iso} -> iso end)

      sample("conc round #{r} #{k} live")
      Enum.each(isos, &JSEngine.destroy/1)
      sample("conc round #{r} destroyed")
    end
  end
end

case System.argv() do
  ["seq", n | src] -> Leak.seq(String.to_integer(n), Leak.code(src))
  ["conc", k, rounds | src] -> Leak.conc(String.to_integer(k), String.to_integer(rounds), Leak.code(src))
end

Leak.sample("end")

# LEAK_REPORT=path: write macOS `leaks` output (unreachable malloc blocks)
# there. Run with MallocStackLogging=1 to get an allocation stack per leak.
# LEAK_VMMAP_FULL=path: write the full `vmmap --summary` there.
if path = System.get_env("LEAK_VMMAP_FULL") do
  File.write!(path, Leak.sh("vmmap --summary #{System.pid()} 2>&1"))
end

if path = System.get_env("LEAK_REPORT") do
  File.write!(path, Leak.sh("leaks #{System.pid()} 2>&1"))
end

System.halt(0)
