// @flow
/* eslint-env node */

import App, {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {mock as M3Plugin, M3Token} from '@uber/fusion-plugin-m3';
import TChannel, {TChannelToken} from '@uber/fusion-plugin-tchannel';
import TracerPlugin, {
  TracerToken,
  TracerConfigToken,
  TracerOptionsToken,
} from '@uber/fusion-plugin-tracer';
import AtreyuPlugin, {AtreyuToken, AtreyuConfigToken} from '../index';
import {getSimulator} from 'fusion-test-utils';
import jaeger from 'jaeger-client';
import test from 'tape-cup';
import unique from 'array-unique';

const mockLogger = {
  log: (msg: any): any => {},
  error: (msg: any): any => {},
  warn: (msg: any): any => {},
  info: (msg: any): any => {},
  verbose: (msg: any): any => {},
  debug: (msg: any): any => {},
  silly: (msg: any): any => {},
  trace: (msg: any): any => {},
};
const MockLogger = {
  ...mockLogger,
  createChild() {
    return mockLogger;
  },
};

const getPlugin = passContext =>
  createPlugin({
    deps: {
      atreyu: AtreyuToken,
      tracer: TracerToken,
    },
    middleware: ({atreyu, tracer}) => {
      const userInfo = atreyu.createAsyncGraph({
        user: {
          service: 'api',
          method: 'GET',
          path: '/user',
          response: (err, result, cb) => {
            cb(null, {name: 'Uber', id: 123});
          },
        },
      });
      return async (ctx, next) => {
        if (ctx.path === '/userinfo') {
          const data = {id: 123};
          const result = await userInfo(data, passContext ? ctx : undefined);
          ctx.body = result.user;
        }
        next();
      };
    },
  });

const inMemoryReporter = new jaeger.InMemoryReporter();
const getServer = () => {
  const app = new App('test', el => el);
  app.register(LoggerToken, MockLogger);
  app.register(M3Token, M3Plugin);
  app.register(TChannelToken, TChannel);
  // $FlowFixMe
  app.register(TracerConfigToken, {
    serviceName: 'test-app',
    sampler: {
      type: 'const',
      param: 1,
    },
  });
  // $FlowFixMe
  app.register(TracerOptionsToken, {reporter: inMemoryReporter});
  app.register(TracerToken, TracerPlugin);
  app.register(AtreyuToken, AtreyuPlugin);
  app.register(AtreyuConfigToken, {
    appName: 'test-app',
    serviceNames: ['api'],
  });

  return app;
};

test('Should support end to end tracing', async t => {
  const app = getServer();
  app.register(getPlugin(true));

  const sim = getSimulator(app);
  const response = await sim.request('/userinfo', {
    headers: {'x-uber-source': 'fusion'},
  });

  t.deepEquals(
    response.body,
    {name: 'Uber', id: 123},
    'should receive a successful response'
  );

  const spans = inMemoryReporter._spans.map(function m(span) {
    return span._operationName;
  });
  t.deepEquals(
    spans,
    [
      'GET.api.user',
      'atreyu.node.user',
      'atreyu.graph.atreyu',
      'GET_/userinfo',
    ],
    'should have all traces end to end'
  );

  const traceIds = inMemoryReporter._spans.map(function m(span) {
    return span._spanContext._traceId.toString('hex');
  });
  t.equals(
    unique(traceIds).length,
    1,
    'should have the same traceId for all spans'
  );

  inMemoryReporter.clear();
  app.cleanup();
  t.end();
});

test('Should individually trace when context is not passed', async t => {
  const app = getServer();
  app.register(getPlugin(false));

  const sim = getSimulator(app);
  const response = await sim.request('/userinfo', {
    headers: {'x-uber-source': 'fusion'},
  });

  t.deepEquals(
    response.body,
    {name: 'Uber', id: 123},
    'should receive a successful response'
  );

  const spans = inMemoryReporter._spans.map(function m(span) {
    return span._operationName;
  });
  t.deepEquals(
    spans,
    [
      'GET.api.user',
      'atreyu.node.user',
      'atreyu.graph.atreyu',
      'GET_/userinfo',
    ],
    'should have all traces end to end'
  );

  const traceIds = inMemoryReporter._spans.map(function m(span) {
    return span._spanContext._traceId.toString('hex');
  });
  t.equals(
    unique(traceIds).length,
    2,
    'should have two traceIds (fusion server and atreyu)'
  );

  inMemoryReporter.clear();
  app.cleanup();
  t.end();
});
