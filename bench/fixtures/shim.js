// Host shim for the try Elm worker: same in node and jsengine.
globalThis.tryInit = function () {
  globalThis.__app = Elm.Try.init({});
  return true;
};
function call(req) {
  const app = globalThis.__app;
  return new Promise((done) => {
    const listener = (reply) => { app.ports.output.unsubscribe(listener); done(reply); };
    app.ports.output.subscribe(listener);
    app.ports.input.send(req);
  });
}
globalThis.tryLoad = async function (name, jsonText, typeText) {
  const req = { cmd: "load", name, json: JSON.parse(jsonText) };
  if (typeText) req.type = JSON.parse(typeText);
  const r = await call(req);
  return { ok: r.ok, error: r.error ?? null };
};
globalThis.tryNodes = function (text) { globalThis.__nodes = JSON.parse(text); return Object.keys(globalThis.__nodes); };
globalThis.tryRun = async function (key) {
  const r = await call({ cmd: "run", node: globalThis.__nodes[key], choices: {}, alignments: {} });
  return { keys: Object.keys(r), bytes: JSON.stringify(r).length, ok: r.ok ?? null, status: r.status ?? r.kind ?? null };
};
globalThis.tryBench = async function (key, n) {
  const t0 = Date.now();
  for (let i = 0; i < n; i++) await call({ cmd: "run", node: globalThis.__nodes[key], choices: {}, alignments: {} });
  return (Date.now() - t0) / n;
};
globalThis.trySyncCheck = async function () {
  let got = false;
  const p = call({ cmd: "data" }).then(() => { got = true; });
  const sync = got;
  await p;
  return sync;
};
globalThis.tryRunFull = async function (key) {
  return await call({ cmd: "run", node: globalThis.__nodes[key], choices: {}, alignments: {} });
};
