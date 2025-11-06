# Minimal test - just try to call the NIFs directly
# This bypasses Mix and just tests if the NIF loads

Code.prepend_path("_build/test/lib/jsengine/ebin")

try do
  # Try to load the module
  Code.ensure_loaded?(JSEngine)
  IO.puts("✓ JSEngine module loaded")

  # Try calling run with default environment
  result = JSEngine.run("1 + 1")
  IO.puts("Result: #{inspect(result)}")

  # Check if we got the NIF error or actual result
  case result do
    {:error, {:nif_not_loaded, _}} ->
      IO.puts("✗ NIF not loaded - this means the shared library isn't being found")
    {:ok, _} ->
      IO.puts("✓ NIF is working!")
    other ->
      IO.puts("Got: #{inspect(other)}")
  end
rescue
  e in UndefinedFunctionError ->
    IO.puts("✗ Function not defined: #{inspect(e)}")
  e ->
    IO.puts("✗ Error: #{inspect(e)}")
end
