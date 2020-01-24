// @flow
/* eslint-env node */

import plugin from '../server';

function createAtreyuPlugin() {
  let numConstructors = 0;
  class Client {
    constructor(config, options) {
      numConstructors++;
      expect(numConstructors).toBe(1);
      expect(config).toStrictEqual({a: true, appName: 'dev-service'});
      expect(options.a).toBe('b');
      expect(options.m3).toBe('m3');
      expect(options.logger).toBe('logger');
      expect(options.galileo).toBe('galileo');
      expect(options.tracer).toBe('tracer');
      expect(options.hyperbahnClient).toBe('hyperbahn');
    }
    createGraph(arg, arg2) {
      expect(arg).toBe('graph-arg');
      expect(arg2).toBe('graph-arg2');
      return {
        resolve: (resolveArg1, options, cb) => {
          expect(resolveArg1).toBe('graph-resolve-arg');
          cb(null, 'graph-result');
        },
      };
    }
    createRequest(arg, arg2) {
      expect(arg).toBe('req-arg');
      expect(arg2).toBe('req-arg2');
      return {
        resolve: (resolveArg1, options, cb) => {
          expect(resolveArg1).toBe('req-resolve-arg');
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

    expect(atreyu instanceof Client).toBeTruthy();

    return atreyu;
  }
}

test('Atreyu Plugin Interface', async done => {
  expect(typeof plugin).toBe('object');
  const atreyu = createAtreyuPlugin();
  if (atreyu) {
    // make flow happy
    expect(
      await atreyu.createAsyncGraph(
        'graph-arg',
        'graph-arg2'
      )('graph-resolve-arg')
    ).toBe('graph-result');
    expect(
      await atreyu.createAsyncRequest('req-arg', 'req-arg2')('req-resolve-arg')
    ).toBe('req-result');
    done();
  }
});

test('Atreyu Plugin optional deps', async done => {
  expect(typeof plugin).toBe('object');

  class OptDepsClient {
    constructor(config, options) {
      expect(config).toStrictEqual({a: true, appName: 'dev-service'});
      expect(options.galileo).toBe(null);
      expect(options.tracer).toBe(null);
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

    expect(atreyu instanceof OptDepsClient).toBeTruthy();
    done();
  }
});
