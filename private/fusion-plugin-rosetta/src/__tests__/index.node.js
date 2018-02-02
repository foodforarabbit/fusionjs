import tape from 'tape-cup';
import App, {createToken} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';
import plugin, {ClientToken, ConfigToken} from '../server';

const RosettaToken = createToken('RosettaToken');

tape('Rosetta plugin', async t => {
  class Client {
    constructor({logger, thing}) {
      this.locales = ['en_US'];
      this.translations = {
        en_US: {
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
  const app = new App('el', el => el);
  app.register(RosettaToken, plugin);
  app.register(LoggerToken, 'mock-logger');
  app.register(ClientToken, Client);
  app.register(ConfigToken, {thing: 'test'});
  app.middleware({rosetta: RosettaToken}, ({rosetta}) => {
    t.ok(rosetta instanceof Client, 'exposes the client');
    rosetta.clearInterval();
    return (ctx, next) => {
      const {translations, locale} = rosetta.from(ctx);
      t.deepLooseEqual(translations, {hello: 'world'});
      t.equal(locale.normalized, 'en_US');
      return next();
    };
  });
  const sim = getSimulator(app);
  await sim.request('/');
  t.end();
});
