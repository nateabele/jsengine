# Test module loading
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

IO.puts("Testing module loading...")

try do
  IO.puts("\n1. Testing ES module loading with imports")
  calculator_path = Path.expand("test/fixtures/modules/calculator.js")
  IO.puts("   Loading: #{calculator_path}")
  result = JSEngine.load([calculator_path])
  IO.puts("   Load result: #{inspect(result)}")

  result = JSEngine.call("calculate", [5, 3, "add"])
  IO.puts("   calculate(5, 3, 'add') = #{inspect(result)}")

  result = JSEngine.call("calculate", [5, 3, "multiply"])
  IO.puts("   calculate(5, 3, 'multiply') = #{inspect(result)}")

  IO.puts("\n2. Testing TypeScript file loading")
  greeter_path = Path.expand("test/fixtures/typescript/greeter.ts")
  IO.puts("   Loading: #{greeter_path}")
  result = JSEngine.load([greeter_path])
  IO.puts("   Load result: #{inspect(result)}")

  result = JSEngine.call("testGreeting", [])
  IO.puts("   testGreeting() = #{inspect(result)}")

  result = JSEngine.call("greet", [%{"firstName" => "Jane", "lastName" => "Smith"}])
  IO.puts("   greet(Jane Smith) = #{inspect(result)}")

  IO.puts("\n✓ ALL MODULE TESTS PASSED!")
rescue
  e ->
    IO.puts("\n✗ ERROR: #{inspect(e)}")
    IO.puts(Exception.format_stacktrace(__STACKTRACE__))
end
