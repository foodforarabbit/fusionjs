// @flow
import App, {createToken} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';

import plugin from '../src/server.js';
import {ClientToken, ConfigToken} from '../src/tokens.js';

const RosettaToken = createToken('RosettaToken');

test('Rosetta plugin', async () => {
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
      expect(logger).toBe('mock-logger');
      expect(thing).toBe('test');
    }
    load() {
      expect('calls the load function').toBeTruthy();
      return Promise.resolve();
    }
    setLoadInterval() {
      expect('calls the setLoadIntervalFunction').toBeTruthy();
    }
    clearInterval() {
      expect('calls the clearInterval function').toBeTruthy();
    }
  }
  const app = new App('el', el => el);
  app.register(RosettaToken, plugin);
  // $FlowFixMe
  app.register(LoggerToken, 'mock-logger');
  app.register(ClientToken, Client);
  // $FlowFixMe
  app.register(ConfigToken, {thing: 'test'});
  app.middleware({rosetta: RosettaToken}, ({rosetta}) => {
    const {client} = rosetta;
    expect(client instanceof Client).toBeTruthy();
    client.clearInterval();
    return (ctx, next) => {
      const {translations, locale} = rosetta.from(ctx);
      expect(translations).toStrictEqual({hello: 'world'});
      expect(locale.normalized).toBe('en');
      return next();
    };
  });
  const sim = getSimulator(app);
  await sim.request('/');
});
