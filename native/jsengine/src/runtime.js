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

  globalThis.setTimeout = function(handler, timeout = 0) {
    core.ops.op_set_timeout(timeout).then(handler);
  };

})(globalThis);
