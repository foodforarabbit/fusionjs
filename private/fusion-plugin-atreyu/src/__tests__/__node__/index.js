/* eslint-env node */

import test from 'tape-cup';
import plugin from '../../server';

test('interface', async t => {
  t.equals(typeof plugin, 'function');

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
  const Logger = {
    of() {
      return {
        createChild() {
          return 'logger';
        },
      };
    },
  };
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

  // check for singleton
  const nextInstance = Atreyu.of();
  t.equal(instance, nextInstance, 'uses singleton');
  t.end();
});
