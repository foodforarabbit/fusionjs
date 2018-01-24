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
  const m3 = 'm3';
  const logger = 'logger';
  const tracer = 'tracer';
  const galileo = 'galileo';
  const tchannel = {hyperbahn: 'hyperbahn'};

  const atreyu = plugin.provides({
    config: 'abc',
    m3,
    logger,
    tracer,
    galileo,
    tchannel,
    options: {a: 'b'},
    Client,
  });

  t.ok(atreyu instanceof Client, 'passes through context');

  return atreyu;
}

test('Atreyu Plugin Interface', t => {
  t.equals(typeof plugin, 'object');
  createAtreyuPlugin(t);
  t.end();
});

test('Atreyu Plugin Mock Interface', t => {
  t.equals(typeof AtreyuMockPlugin.provides, 'function');

  const atreyu = createAtreyuPlugin(t);
  const atreyuMocker = AtreyuMockPlugin.provides({atreyu});

  t.ok(atreyuMocker, 'should return atreyu mock interface');
  t.ok(atreyuMocker.mockHttp, 'should expose interface to mock http');
  t.ok(atreyuMocker.mockTChannel, 'should expose interface to mock tchannel');

  t.end();
});
