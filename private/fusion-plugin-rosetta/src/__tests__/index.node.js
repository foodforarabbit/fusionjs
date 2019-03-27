// @flow
import tape from 'tape-cup';

import App, {createToken} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';

import plugin from '../server.js';
import {ClientToken, ConfigToken} from '../tokens.js';

const RosettaToken = createToken('RosettaToken');

tape('Rosetta plugin', async t => {
  class Client {
    locales: any;
    translations: any;

    constructor({logger, thing}) {
      this.locales = ['en_US'];
      this.translations = {
        en: {
          hello: 'world',
        },
      };
      t.equal(logger, 'mock-logger', 'passes a logger through');
      t.equal(thing, 'test', 'passes other config through');
    }
    load() {
      t.ok('calls the load function');
      return Promise.resolve();
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
  // $FlowFixMe
  app.register(LoggerToken, 'mock-logger');
  // $FlowFixMe
  app.register(ClientToken, Client);
  // $FlowFixMe
  app.register(ConfigToken, {thing: 'test'});
  app.middleware({rosetta: RosettaToken}, ({rosetta}) => {
    t.ok(rosetta instanceof Client, 'exposes the client');
    rosetta.clearInterval();
    return (ctx, next) => {
      const {translations, locale} = rosetta.from(ctx);
      t.deepLooseEqual(translations, {hello: 'world'});
      t.equal(locale.normalized, 'en');
      return next();
    };
  });
  const sim = getSimulator(app);
  await sim.request('/');
  t.end();
});
