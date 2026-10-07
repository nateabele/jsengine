// runtime.js
((globalThis) => {
  const { core } = Deno;

  function argsToMessage(...args) {
    return args.map((arg) => JSON.stringify(arg)).join(" ");
  }

  globalThis.console = globalThis.console || {};

  Object.assign(globalThis.console, {
    log: (...args) => {
      core.print(`[out]: ${argsToMessage(...args)}\n`, false);
    },
    error: (...args) => {
      core.print(`[err]: ${argsToMessage(...args)}\n`, true);
    },
  });

  // Pending timers: id -> { rid, handler, args }. The handler and its
  // arguments live only here, so clearTimeout releases them at once; the
  // promise callbacks below hold just the id and the rid. `rid` is the
  // CancelHandle resource of the Rust sleep: closing it cancels the sleep,
  // so a cleared timer leaves no async work behind.
  const timers = new Map();
  let nextTimerId = 1;

  globalThis.setTimeout = function(handler, timeout = 0, ...args) {
    const rid = core.ops.op_timer_handle();
    let sleep;
    try {
      sleep = core.ops.op_set_timeout(timeout, rid);
    } catch (error) {
      core.tryClose(rid);
      throw error;
    }
    const id = nextTimerId++;
    timers.set(id, { rid, handler, args });
    sleep.then(
      () => {
        const timer = timers.get(id);
        if (timer === undefined) return;
        timers.delete(id);
        core.tryClose(rid);
        if (typeof timer.handler === "function") timer.handler(...timer.args);
      },
      (error) => {
        const timer = timers.get(id);
        core.tryClose(rid);
        // A cleared timer's sleep ends cancelled: nothing to report.
        if (timer === undefined) return;
        timers.delete(id);
        throw error;
      },
    );
    return id;
  };

  // A no-op for undefined, an unknown id, or a timer that already fired.
  globalThis.clearTimeout = function(id) {
    const key = typeof id === "number" ? id : Number(id);
    const timer = timers.get(key);
    if (timer === undefined) return;
    timers.delete(key);
    core.ops.op_clear_timer(timer.rid);
  };

})(globalThis);
