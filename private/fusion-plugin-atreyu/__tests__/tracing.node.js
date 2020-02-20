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
import AtreyuPlugin, {AtreyuToken, AtreyuConfigToken} from '../src/index';
import {getSimulator} from 'fusion-test-utils';
import jaeger from 'jaeger-client';
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

const verifyTrace = (type, traceSpans, singleTrace) => {
  const isRequest = type === 'request';
  const spans = traceSpans.map(function m(span) {
    return span._operationName;
  });
  expect(spans).toEqual([
    isRequest ? 'GET.api.request' : 'GET.api.user',
    isRequest ? 'atreyu.node.request' : 'atreyu.node.user',
    'atreyu.graph.atreyu',
    'unknown_route',
  ]);

  const traceIds = traceSpans.map(function m(span) {
    return span._spanContext._traceId.toString('hex');
  });
  expect(unique(traceIds).length).toBe(singleTrace ? 1 : 2);
};

const fireAndVerifyResponse = async app => {
  const sim = getSimulator(app);
  const response = await sim.request('/userinfo', {
    headers: {'x-uber-source': 'fusion'},
  });

  expect(response.body).toEqual({name: 'Uber', id: 123});
};

test('graph should support end to end tracing', async () => {
  const app = getServer();
  app.register(getPlugin('graph', true));
  await fireAndVerifyResponse(app);

  verifyTrace('graph', inMemoryReporter._spans, true);

  inMemoryReporter.clear();
  app.cleanup();
});

test('graph should support end to end tracing when options are passed', async () => {
  const app = getServer();
  app.register(getPlugin('graph', false));
  await fireAndVerifyResponse(app);

  verifyTrace('graph', inMemoryReporter._spans, true);

  inMemoryReporter.clear();
  app.cleanup();
});

test('graph should individually trace', async () => {
  const app = getServer();
  app.register(getPlugin('graph'));
  await fireAndVerifyResponse(app);

  verifyTrace('graph', inMemoryReporter._spans, false);

  inMemoryReporter.clear();
  app.cleanup();
});

test('request should support end to end tracing', async () => {
  const app = getServer();
  app.register(getPlugin('request', true));
  await fireAndVerifyResponse(app);

  verifyTrace('request', inMemoryReporter._spans, true);

  inMemoryReporter.clear();
  app.cleanup();
});

test('request should support end to end tracing when options are passed', async () => {
  const app = getServer();
  app.register(getPlugin('request', false));
  await fireAndVerifyResponse(app);

  verifyTrace('request', inMemoryReporter._spans, true);

  inMemoryReporter.clear();
  app.cleanup();
});

test('request should individually trace', async () => {
  const app = getServer();
  app.register(getPlugin('request'));
  await fireAndVerifyResponse(app);

  verifyTrace('request', inMemoryReporter._spans, false);

  inMemoryReporter.clear();
  app.cleanup();
});
