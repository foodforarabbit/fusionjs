// @flow
/* eslint-env node */

import test from 'tape-cup';
import plugin from '../server';

function createAtreyuPlugin(t) {
  let numConstructors = 0;
  class Client {
    constructor(config, options) {
      numConstructors++;
      t.equal(numConstructors, 1, 'only calls constructor once');
      t.deepLooseEqual(config, {a: true, appName: 'dev-service'});
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
    createGraph(arg, arg2) {
      t.equal(arg, 'graph-arg');
      t.equal(arg2, 'graph-arg2');
      return {
        resolve: (resolveArg1, options, cb) => {
          t.equal(resolveArg1, 'graph-resolve-arg');
          cb(null, 'graph-result');
        },
      };
    }
    createRequest(arg, arg2) {
      t.equal(arg, 'req-arg');
      t.equal(arg2, 'req-arg2');
      return {
        resolve: (resolveArg1, options, cb) => {
          t.equal(resolveArg1, 'req-resolve-arg');
          cb(null, 'req-result');
        },
      };
    }
    createAsyncGraph(arg, arg2) {}
    createAsyncRequest(arg, arg2) {}
  }
  const m3: any = 'm3';
  const logger: any = 'logger';
  const tracer: any = {tracer: 'tracer'};
  const galileo: any = {galileo: 'galileo'};
  const tchannel: any = {hyperbahn: 'hyperbahn'};

  if (plugin.provides) {
    // make flow happy
    const atreyu = plugin.provides({
      config: {a: true},
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
}

test('Atreyu Plugin Interface', async t => {
  t.equals(typeof plugin, 'object');
  const atreyu = createAtreyuPlugin(t);
  if (atreyu) {
    // make flow happy
    t.equals(
      await atreyu.createAsyncGraph(
        'graph-arg',
        'graph-arg2'
      )('graph-resolve-arg'),
      'graph-result'
    );
    t.equals(
      await atreyu.createAsyncRequest('req-arg', 'req-arg2')('req-resolve-arg'),
      'req-result'
    );
    t.end();
  }
});

test('Atreyu Plugin optional deps', async t => {
  t.equals(typeof plugin, 'object');

  class OptDepsClient {
    constructor(config, options) {
      t.deepLooseEqual(config, {a: true, appName: 'dev-service'});
      t.equal(options.galileo, null, 'galileo client does not pass through');
      t.equal(options.tracer, null, 'tracer client does not pass through');
    }
  }

  const m3: any = 'm3';
  const logger: any = 'logger';
  const galileo: any = undefined;
  const tracer: any = undefined;
  const tchannel: any = {hyperbahn: 'hyperbahn'};

  if (plugin.provides) {
    const atreyu = plugin.provides({
      config: {a: true},
      m3,
      logger,
      galileo,
      tracer,
      tchannel,
      options: {a: 'b'},
      Client: OptDepsClient,
    });

    t.ok(
      atreyu instanceof OptDepsClient,
      'atreyu instance successfully created'
    );
    t.end();
  }
});
