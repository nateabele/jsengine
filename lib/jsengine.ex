defmodule JSEngine do
  use Rustler, otp_app: :jsengine, crate: "jsengine"

  # Environment management
  @spec create_env() :: {:ok, reference()} | {:error, term()}
  def create_env(), do: error()

  @spec destroy_env(reference()) :: :ok | {:error, term()}
  def destroy_env(_env_id), do: error()

  # Default environment API (backward compatible)
  @spec load(list()) :: term()
  def load(files) when is_list(files), do: load(:default, files)

  @spec run(String.t()) :: term()
  def run(code) when is_binary(code), do: run(:default, code)

  @spec call(String.t(), [any()]) :: term()
  def call(function_name, args \\ []) when is_binary(function_name), do: call(:default, function_name, args)

  # Environment-specific API
  @spec load(reference() | atom(), list()) :: term()
  def load(_env_id, _files), do: error()

  @spec run(reference() | atom(), String.t()) :: term()
  def run(_env_id, _code), do: error()

  @spec call(reference() | atom(), String.t(), [any()]) :: term()
  def call(_env_id, _function_name, _args), do: error()

  defp error(), do: :erlang.nif_error(:nif_not_loaded)
end
