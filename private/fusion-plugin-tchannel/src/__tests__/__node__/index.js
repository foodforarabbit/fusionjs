/* eslint-env node */

import test from 'tape-cup';
import plugin from '../../server';

test('interface', async t => {
  t.equals(typeof plugin, 'function');

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
  class HyperbahnClient {
    constructor(options) {
      t.ok(options, 'passes options to hyperbahn client');
    }
    destroy() {
      t.pass('calls destroy');
    }
  }

  const mockLogger = {
    of() {
      return {
        createChild() {},
        info() {},
        warn() {},
        error() {},
      };
    },
  };

  const mockM3 = {
    of() {
      return {};
    },
  };

  const Tchannel = plugin({
    appName: 'hello',
    config: {
      hyperbahn: {
        hostPortList: [],
      },
    },
    Logger: mockLogger,
    M3: mockM3,
    TChannelClient,
    HyperbahnClient,
  });

  const {tchannel, hyperbahn} = Tchannel.of();
  t.ok(
    tchannel instanceof TChannelClient,
    'creates an instance of the tchannel client'
  );
  t.ok(
    hyperbahn instanceof HyperbahnClient,
    'creates an instance of the hyperbahn client'
  );
  t.equal(
    typeof Tchannel.of().cleanup,
    'function',
    'exports a cleanup function'
  );
  Tchannel.of().cleanup();
  t.end();
});
