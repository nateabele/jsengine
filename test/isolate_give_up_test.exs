defmodule JSEngine.IsolateGiveUpTest do
  # Not async: it shortens the reply grace period through the app env.
  use ExUnit.Case, async: false

  setup do
    Application.put_env(:jsengine, :reply_grace_ms, 100)
    on_exit(fn -> Application.delete_env(:jsengine, :reply_grace_ms) end)
  end

  test "a thread stuck outside JavaScript gives :timeout and no late reply reaches the mailbox" do
    {:ok, isolate} = JSEngine.create_isolate(%{heap_mb: 64})
    started = System.monotonic_time(:millisecond)

    # The isolate thread sleeps 2.5 s in Rust; the deadline (100 ms) cannot
    # stop it, so the caller gives up after deadline + grace (200 ms).
    assert {:error, :timeout} = JSEngine.__test_stall__(isolate, 2_500, 100)
    refute JSEngine.alive?(isolate)

    # Wait until the stalled request has finished on the isolate thread.
    Process.sleep(max(0, started + 3_000 - System.monotonic_time(:millisecond)))
    refute_received {:jsengine_reply, _, _}
  end
end
