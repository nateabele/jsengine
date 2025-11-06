defmodule Jsengine.MixProject do
  use Mix.Project

  def project do
    [
      app: :jsengine,
      version: "0.1.0",
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      compilers: [:rustler] ++ Mix.compilers(),
      rustler_crates: [
        jsengine: [
          path: "native/jsengine",
          mode: rustler_mode(Mix.env())
        ]
      ],
      deps: deps()
    ]
  end

  defp rustler_mode(:prod), do: :release
  defp rustler_mode(_), do: :debug

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:rustler, "~> 0.30.0"}
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
    ]
  end
end
