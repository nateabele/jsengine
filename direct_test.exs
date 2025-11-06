# Direct test without Mix - manually load the NIF
defmodule JSEngine do
  @on_load :load_nif

  def load_nif do
    path = Path.join([__DIR__, "priv", "native", "libjsengine"])
    :erlang.load_nif(String.to_charlist(path), 0)
  end

  # Environment management
  def create_env(), do: raise "NIF not loaded"
  def destroy_env(_env_id), do: raise "NIF not loaded"

  # Default environment API (backward compatible)
  def load(files) when is_list(files), do: load_env(:default, files)
  def run(code) when is_binary(code), do: run_env(:default, code)
  def call(function_name, args \\ []) when is_binary(function_name),
    do: call_env(:default, function_name, args)

  # Environment-specific API
  def load(env_id, files) when is_list(files), do: load_env(env_id, files)
  def run(env_id, code) when is_binary(code), do: run_env(env_id, code)
  def call(env_id, function_name, args) when is_binary(function_name),
    do: call_env(env_id, function_name, args)

  # Internal NIFs
  defp load_env(_env_id, _files), do: raise "NIF not loaded"
  defp run_env(_env_id, _code), do: raise "NIF not loaded"
  defp call_env(_env_id, _function_name, _args), do: raise "NIF not loaded"
end

# Run basic tests
IO.puts("Testing JSEngine direct NIF loading...")

try do
  IO.puts("\n1. Testing basic run")
  result = JSEngine.run("1 + 1")
  IO.puts("   Result: #{inspect(result)}")

  IO.puts("\n2. Testing function definition and call")
  JSEngine.run("function add(a, b) { return a + b; }")
  result = JSEngine.call("add", [5, 3])
  IO.puts("   add(5, 3) = #{inspect(result)}")

  IO.puts("\n3. Testing TypeScript")
  ts_code = """
  function multiply(a: number, b: number): number {
    return a * b;
  }
  globalThis.multiply = multiply;
  """
  JSEngine.run(ts_code)
  result = JSEngine.call("multiply", [6, 7])
  IO.puts("   multiply(6, 7) = #{inspect(result)}")

  IO.puts("\n4. Testing environment creation")
  {:ok, env} = JSEngine.create_env()
  IO.puts("   Created environment: #{inspect(env)}")
  JSEngine.run(env, "globalThis.test = 42")
  JSEngine.run(env, "globalThis.getTest = () => globalThis.test")
  result = JSEngine.call(env, "getTest", [])
  IO.puts("   env.getTest() = #{inspect(result)}")

  IO.puts("\n✓ ALL TESTS PASSED!")
rescue
  e ->
    IO.puts("\n✗ ERROR: #{inspect(e)}")
    IO.puts(Exception.format_stacktrace(__STACKTRACE__))
end
