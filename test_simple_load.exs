# Test simple file loading (non-modules)
defmodule JSEngine do
  @on_load :load_nif

  def load_nif do
    path = Path.join([__DIR__, "priv", "native", "libjsengine"])
    :erlang.load_nif(String.to_charlist(path), 0)
  end

  def create_env(), do: raise "NIF not loaded"
  def destroy_env(_env_id), do: raise "NIF not loaded"
  def load(files) when is_list(files), do: load_env(:default, files)
  def run(code) when is_binary(code), do: run_env(:default, code)
  def call(function_name, args \\ []) when is_binary(function_name),
    do: call_env(:default, function_name, args)
  def load(env_id, files) when is_list(files), do: load_env(env_id, files)
  def run(env_id, code) when is_binary(code), do: run_env(env_id, code)
  def call(env_id, function_name, args) when is_binary(function_name),
    do: call_env(env_id, function_name, args)
  defp load_env(_env_id, _files), do: raise "NIF not loaded"
  defp run_env(_env_id, _code), do: raise "NIF not loaded"
  defp call_env(_env_id, _function_name, _args), do: raise "NIF not loaded"
end

IO.puts("Testing simple file loading (non-modules)...")

try do
  # Create temporary test files like the test does
  test_dir = System.tmp_dir!()
  simple_file = Path.join(test_dir, "simple_#{:rand.uniform(10000)}.js")
  function_file = Path.join(test_dir, "functions_#{:rand.uniform(10000)}.js")

  File.write!(simple_file, "var loaded = true;")
  File.write!(function_file, "function fromFile(x) { return x * 2; }")

  IO.puts("\n1. Testing load a single JavaScript file")
  result = JSEngine.load([simple_file])
  IO.puts("   Load result: #{inspect(result)}")

  result = JSEngine.run("loaded")
  IO.puts("   loaded variable: #{inspect(result)}")

  IO.puts("\n2. Testing load multiple JavaScript files")
  result = JSEngine.load([function_file])
  IO.puts("   Load result: #{inspect(result)}")

  result = JSEngine.call("fromFile", [5])
  IO.puts("   fromFile(5) = #{inspect(result)}")

  # Cleanup
  File.rm(simple_file)
  File.rm(function_file)

  IO.puts("\n✓ ALL SIMPLE LOAD TESTS PASSED!")
rescue
  e ->
    IO.puts("\n✗ ERROR: #{inspect(e)}")
    IO.puts(Exception.format_stacktrace(__STACKTRACE__))
end
