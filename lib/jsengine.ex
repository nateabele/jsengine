defmodule JSEngine do
  use Rustler, otp_app: :jsengine, crate: "jsengine"

  @spec load(list()) :: term()
  def load(_files), do: error()

  @spec run(String.t()) :: term()
  def run(_code \\ :standard), do: error()

  @spec call(String.t(), [any()]) :: term()
  def call(_function_name, _args \\ :standard), do: error()

  defp error(), do: :erlang.nif_error(:nif_not_loaded)
end
