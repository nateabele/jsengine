defmodule JSEngine do
  use Rustler, otp_app: :jsengine, crate: "jsengine"

  # Environment management
  @spec create_env() :: {:ok, reference()} | {:error, term()}
  def create_env(), do: error()

  @spec destroy_env(reference()) :: :ok | {:error, term()}
  def destroy_env(_env_id), do: error()

  # Default environment API (backward compatible)
  @spec load(list()) :: term()
  def load(files) when is_list(files), do: load_env(:default, files)

  @spec run(String.t()) :: term()
  def run(code) when is_binary(code), do: run_env(:default, code)

  @spec call(String.t(), [any()]) :: term()
  def call(function_name, args \\ []) when is_binary(function_name),
    do: call_env(:default, function_name, args)

  # Environment-specific API
  @spec load(reference() | atom(), list()) :: term()
  def load(env_id, files) when is_list(files), do: load_env(env_id, files)

  @spec run(reference() | atom(), String.t()) :: term()
  def run(env_id, code) when is_binary(code), do: run_env(env_id, code)

  @spec call(reference() | atom(), String.t(), [any()]) :: term()
  def call(env_id, function_name, args) when is_binary(function_name),
    do: call_env(env_id, function_name, args)

  # Internal NIFs (replaced by Rust implementations)
  defp load_env(_env_id, _files), do: error()
  defp run_env(_env_id, _code), do: error()
  defp call_env(_env_id, _function_name, _args), do: error()

  defp error(), do: :erlang.nif_error(:nif_not_loaded)
end
