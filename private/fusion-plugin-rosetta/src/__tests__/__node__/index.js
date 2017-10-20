import tape from 'tape-cup';
import plugin from '../../server';

tape('Rosetta plugin', t => {
  t.plan(8);
  class Client {
    constructor({logger, thing}) {
      t.equal(logger, 'mock-logger', 'passes a logger through');
      t.equal(thing, 'test', 'passes other config through');
    }
    load() {
      t.ok('calls the load function');
    }
    setLoadInterval() {
      t.ok('calls the setLoadIntervalFunction');
    }
    clearInterval() {
      t.ok('calls the clearInterval function');
    }
  }
  t.equal(typeof plugin, 'function', 'exposes a function as default export');
  const Rosetta = plugin({
    Logger: {
      of() {
        t.ok('calls logger of');
        return 'mock-logger';
      },
    },
    Client,
    thing: 'test',
  });
  const rosetta = Rosetta.of();
  t.ok(rosetta.client instanceof Client, 'exposes the client');
  rosetta.cleanup();
  t.end();
});
