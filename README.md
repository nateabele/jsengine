# JSEngine: An embedded JavaScript runtime for Elixir

Run JavaScript code, right inside Elixir. Just like this:

```elixir
> JSEngine.load(["/path/to/file.js"]);
{:ok, nil}
> JSEngine.run("function add(a, b) { return a + b; }")
{:ok, nil}
> JSEngine.call("add", [1, 2])
{:ok, 3}
```

### Why?

There are a couple other JS-in-Elixir libraries, but either they're [just wrappers around IPC that serialize your function calls into files](https://github.com/le0pard/elixir_v8/issues/5), or else they have [weird edge cases](https://github.com/le0pard/elixir_v8/issues/7) and [issues compiling](https://github.com/le0pard/elixir_v8/issues/5).

This version is implemented in Rust on top of [Deno Core](https://github.com/denoland/deno_core), so it's modern, reliable, safe, and _fast_—and lives fully within the BEAM.

### Features

- Converts JS values to Elixir terms
- Converts function arguments passed in `call` from Elixir terms to JS values
- Automatically unwraps promises

### Roadmap

Because Deno Core has so much packed in, lots more features are within easy reach.

- [x] **Module loading**: Right now, `load()` just executes single self-contained JS files. With module-loading, it's possible to load an ES module that `import`s dependencies, and have those dependencies loaded automatically.
- [x] **TypeScript support**: Automatically load and resolve TypeScript files—no build step required.
- [x] **Multiple environments**: Right now, a single JavaScript environment (`v8::Isolate`) is supported, but multiple independent environments could be supported.

## Startup snapshots

`JSEngine.create_snapshot/3` (or the cached `JSEngine.snapshot_for/3`) loads a
bundle once and keeps a V8 startup snapshot of the heap.
`JSEngine.create_isolate(%{snapshot: snapshot})` then starts an isolate with the
bundle already loaded, without running its top-level code again.

Rules for a bundle that is snapshotted:

- A snapshot is valid only in the OS process (and NIF build) that made it.
  `snapshot_to_binary/1` stamps the build id; `snapshot_from_binary/1` refuses
  another build's bytes.
- The load must leave no async work pending: no timer started at load (refused
  with `{:error, {:js, msg}}`).
- **The load must not instantiate WebAssembly or register a
  FinalizationRegistry target.** V8 aborts the whole OS process (no error is
  returned) when it meets an exported wasm function or a FinalizationRegistry
  with pending cleanup at snapshot time, and jsengine cannot detect these
  cheaply beforehand. asm.js is fine (`--no-validate-asm`).
- Values computed at load from `Date.now()` or `Math.random()` are frozen into
  the snapshot and are the same in every isolate started from it.
- The load is capped by `:timeout_ms` and `:heap_mb` (`{:error, :timeout}`,
  `{:error, :oom}`).

## Installation

If [available in Hex](https://hex.pm/docs/publish), the package can be installed
by adding `jsengine` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:jsengine, "~> 0.1.0"}
  ]
end
```

Documentation can be generated with [ExDoc](https://github.com/elixir-lang/ex_doc)
and published on [HexDocs](https://hexdocs.pm). Once published, the docs can
be found at <https://hexdocs.pm/jsengine>.

