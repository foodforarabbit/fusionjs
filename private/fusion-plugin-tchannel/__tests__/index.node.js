// @flow
/* eslint-env node */
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import plugin from '../src/server';
import {TChannelClientToken} from '../src/tokens';
import {TChannelToken} from '../src/index';

test('interface', async done => {
  expect(plugin).toBeTruthy();

  class TChannelClient {
    constructor(options) {
      expect(options).toBeTruthy();
    }
    listen(...args) {
      expect(args.length).toBe(3);
    }
    close() {}
  }

  const mockLogger = {
    createChild() {},
    info() {},
    warn() {},
    error() {},
  };

  const mockM3 = {};
  const app = new App('el', el => el);
  // $FlowFixMe
  app.register(LoggerToken, mockLogger);
  app.register(TChannelClientToken, TChannelClient);
  app.register(TChannelToken, plugin);
  // $FlowFixMe
  app.register(M3Token, mockM3);
  app.middleware({Tchannel: TChannelToken}, ({Tchannel}) => {
    const {tchannel} = Tchannel;
    expect(tchannel instanceof TChannelClient).toBeTruthy();
    expect(typeof Tchannel.cleanup).toBe('function');
    Tchannel.cleanup();
    done();
    return (ctx, next) => next();
  });

  getSimulator(app);
});
