defmodule JsengineTest do
  use ExUnit.Case
  doctest Jsengine

  test "greets the world" do
    assert Jsengine.hello() == :world
  end
end
