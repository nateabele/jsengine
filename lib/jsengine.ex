defmodule JSEngine do
  use Rustler, otp_app: :jsengine, crate: "jsengine"

  # NIFs - these are replaced by Rust implementations
  def create_env(), do: error()
  def destroy_env(_env_id), do: error()
  def load_env(_env_id, _files), do: error()
  def run_env(_env_id, _code), do: error()
  def call_env(_env_id, _function_name, _args), do: error()

  # Convenience wrappers for default environment
  def load(files) when is_list(files), do: load_env(:default, files)
  def run(code) when is_binary(code), do: run_env(:default, code)
  def call(function_name, args \\ []) when is_binary(function_name),
    do: call_env(:default, function_name, args)

  # Support both default and custom environments
  def load(env_id, files) when is_list(files), do: load_env(env_id, files)
  def run(env_id, code) when is_binary(code), do: run_env(env_id, code)
  def call(env_id, function_name, args) when is_binary(function_name),
    do: call_env(env_id, function_name, args)

  defp error(), do: :erlang.nif_error(:nif_not_loaded)
end
