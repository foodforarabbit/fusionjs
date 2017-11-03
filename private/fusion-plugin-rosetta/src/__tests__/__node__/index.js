import tape from 'tape-cup';
import plugin from '../../server';

tape('Rosetta plugin', t => {
  t.plan(10);
  class Client {
    constructor({logger, thing}) {
      this.locales = ['en-US'];
      this.translations = {
        'en-US': {
          hello: 'world',
        },
      };
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
  t.ok(rosetta instanceof Client, 'exposes the client');
  rosetta.clearInterval();

  const ctx = {
    headers: {
      'accept-language': 'en-US',
    },
  };
  const {translations, locale} = Rosetta.of(ctx);
  t.deepLooseEqual(translations, {hello: 'world'});
  t.equal(locale.toString(), 'en-US');
  t.end();
});
