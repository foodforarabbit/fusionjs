/* eslint-env node */

import test from 'tape-cup';
import plugin from '../../server';
import {AtreyuMockPlugin} from '../../index';

function createAtreyuPlugin(t) {
  let numConstructors = 0;
  class Client {
    constructor(config, options) {
      numConstructors++;
      t.equal(numConstructors, 1, 'only calls constructor once');
      t.equal(config, 'abc');
      t.equal(options.a, 'b', 'extends options');
      t.equal(options.m3, 'm3', 'passes through m3 client');
      t.equal(options.logger, 'logger', 'passes through logger client');
      t.equal(options.galileo, 'galileo', 'passes through galileo client');
      t.equal(options.tracer, 'tracer', 'passes through tracer client');
      t.equal(
        options.hyperbahnClient,
        'hyperbahn',
        'passes through hyperbahn client'
      );
    }
  }
  const M3 = {
    of() {
      return 'm3';
    },
  };
  const Tracer = {
    of() {
      return {tracer: 'tracer'};
    },
  };
  const Galileo = {
    of() {
      return {
        galileo: 'galileo',
      };
    },
  };
  const Logger = {
    of() {
      return 'logger';
    },
  };
  const TChannel = {
    of() {
      return {
        hyperbahn: 'hyperbahn',
      };
    },
  };

  const Atreyu = plugin({
    config: 'abc',
    options: {a: 'b'},
    Client,
    Logger,
    M3,
    Tracer,
    Galileo,
    TChannel,
  });

  const instance = Atreyu.of();
  t.ok(instance instanceof Client, 'passes through context');

  return Atreyu;
}

test('Atreyu Plugin Interface', async t => {
  t.equals(typeof plugin, 'function');
  createAtreyuPlugin(t, true);
  t.end();
});

test('Atreyu Plugin Mock Interface', async t => {
  t.equals(typeof AtreyuMockPlugin, 'function');

  const Atreyu = createAtreyuPlugin(t);
  const AtreyuMocker = AtreyuMockPlugin({Atreyu});
  const atreyuMocker = AtreyuMocker.of();

  t.ok(atreyuMocker, 'should return atreyu mock interface');
  t.ok(atreyuMocker.mockHttp, 'should expose interface to mock http');
  t.ok(atreyuMocker.mockTChannel, 'should expose interface to mock tchannel');

  t.end();
});
