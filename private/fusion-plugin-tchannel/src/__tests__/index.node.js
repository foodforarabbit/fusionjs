// @flow
/* eslint-env node */
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import test from 'tape-cup';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import plugin from '../server';
import {TChannelClientToken} from '../tokens';
import {TChannelToken} from '../index';

test('interface', async t => {
  t.ok(plugin);

  class TChannelClient {
    constructor(options) {
      t.ok(options, 'passes options to tchannel');
    }
    listen(...args) {
      t.equal(args.length, 3, 'calls listen with three args');
    }
    close() {
      t.pass('calls close');
    }
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
    t.ok(
      tchannel instanceof TChannelClient,
      'creates an instance of the tchannel client'
    );
    t.equal(typeof Tchannel.cleanup, 'function', 'exports a cleanup function');
    Tchannel.cleanup();
    t.end();
    return (ctx, next) => next();
  });

  getSimulator(app);
});
