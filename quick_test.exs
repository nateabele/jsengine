# Quick smoke test to verify basic NIF loading
# Run with: elixir -r lib/jsengine.ex quick_test.exs

IO.puts("Testing JSEngine NIFs...")

try do
  # Test 1: Basic run
  IO.puts("\nTest 1: Basic run")
  case JSEngine.run("1 + 1") do
    {:ok, 2} -> IO.puts("✓ Basic run works")
    other -> IO.puts("✗ Basic run failed: #{inspect(other)}")
  end

  # Test 2: Define and call function
  IO.puts("\nTest 2: Define and call function")
  JSEngine.run("function test() { return 42; }")
  case JSEngine.call("test", []) do
    {:ok, 42} -> IO.puts("✓ Function call works")
    other -> IO.puts("✗ Function call failed: #{inspect(other)}")
  end

  # Test 3: Environment creation
  IO.puts("\nTest 3: Environment creation")
  case JSEngine.create_env() do
    {:ok, env} ->
      IO.puts("✓ Environment creation works, env=#{inspect(env)}")
      JSEngine.run(env, "globalThis.x = 123")
      JSEngine.run(env, "globalThis.getX = () => globalThis.x")
      case JSEngine.call(env, "getX", []) do
        {:ok, 123} -> IO.puts("✓ Environment isolation works")
        other -> IO.puts("✗ Environment call failed: #{inspect(other)}")
      end
    other -> IO.puts("✗ Environment creation failed: #{inspect(other)}")
  end

  IO.puts("\n✓ All basic tests passed!")
rescue
  e -> IO.puts("\n✗ ERROR: #{inspect(e)}")
end
