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

const userInfoDef = {
  user: {
    service: 'api',
    method: 'GET',
    path: '/user',
    response: (err, result, cb) => {
      cb(null, {name: 'Uber', id: 123});
    },
  },
};

const getPlugin = (type, passContext) =>
  createPlugin({
    deps: {
      atreyu: AtreyuToken,
      tracer: TracerToken,
    },
    middleware: ({atreyu, tracer}) => {
      const isRequest = type === 'request';
      const userInfo = isRequest
        ? atreyu.createAsyncRequest(userInfoDef.user)
        : atreyu.createAsyncGraph(userInfoDef);
      return async (ctx, next) => {
        if (ctx.path === '/userinfo') {
          const data = {id: 123};
          const options =
            typeof passContext === 'boolean'
              ? passContext
                ? ctx
                : {tracing: {span: tracer.from(ctx).span}}
              : undefined;

          const result = await userInfo(data, options);
          ctx.body = isRequest ? result : result.user;
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

const verifyTrace = (t, type, traceSpans, singleTrace) => {
  const isRequest = type === 'request';
  const spans = traceSpans.map(function m(span) {
    return span._operationName;
  });
  t.deepEquals(
    spans,
    [
      isRequest ? 'GET.api.request' : 'GET.api.user',
      isRequest ? 'atreyu.node.request' : 'atreyu.node.user',
      'atreyu.graph.atreyu',
      'unknown_route',
    ],
    'should have all traces end to end'
  );

  const traceIds = traceSpans.map(function m(span) {
    return span._spanContext._traceId.toString('hex');
  });
  t.equals(
    unique(traceIds).length,
    singleTrace ? 1 : 2,
    'should have the same traceId for all spans'
  );
};

const fireAndVerifyResponse = async (t, app) => {
  const sim = getSimulator(app);
  const response = await sim.request('/userinfo', {
    headers: {'x-uber-source': 'fusion'},
  });

  t.deepEquals(
    response.body,
    {name: 'Uber', id: 123},
    'should receive a successful response'
  );
};

test('graph should support end to end tracing', async t => {
  const app = getServer();
  app.register(getPlugin('graph', true));
  await fireAndVerifyResponse(t, app);

  verifyTrace(t, 'graph', inMemoryReporter._spans, true);

  inMemoryReporter.clear();
  app.cleanup();
  t.end();
});

test('graph should support end to end tracing when options are passed', async t => {
  const app = getServer();
  app.register(getPlugin('graph', false));
  await fireAndVerifyResponse(t, app);

  verifyTrace(t, 'graph', inMemoryReporter._spans, true);

  inMemoryReporter.clear();
  app.cleanup();
  t.end();
});

test('graph should individually trace', async t => {
  const app = getServer();
  app.register(getPlugin('graph'));
  await fireAndVerifyResponse(t, app);

  verifyTrace(t, 'graph', inMemoryReporter._spans, false);

  inMemoryReporter.clear();
  app.cleanup();
  t.end();
});

test('request should support end to end tracing', async t => {
  const app = getServer();
  app.register(getPlugin('request', true));
  await fireAndVerifyResponse(t, app);

  verifyTrace(t, 'request', inMemoryReporter._spans, true);

  inMemoryReporter.clear();
  app.cleanup();
  t.end();
});

test('request should support end to end tracing when options are passed', async t => {
  const app = getServer();
  app.register(getPlugin('request', false));
  await fireAndVerifyResponse(t, app);

  verifyTrace(t, 'request', inMemoryReporter._spans, true);

  inMemoryReporter.clear();
  app.cleanup();
  t.end();
});

test('request should individually trace', async t => {
  const app = getServer();
  app.register(getPlugin('request'));
  await fireAndVerifyResponse(t, app);

  verifyTrace(t, 'request', inMemoryReporter._spans, false);

  inMemoryReporter.clear();
  app.cleanup();
  t.end();
});
