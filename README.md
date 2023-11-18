# JSEngine: An embedded JavaScript runtime for Elixir

Run JavaScript code, right inside Elixir. Just like this:

```elixir
> JSEngine.load(["/path/to/file.js"]);
:ok
> JSEngine.run("function add(a, b) { return a + b; }")
{:ok, nil}
> JSEngine.call("add", [1, 2])
{:ok, 3}
```

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

