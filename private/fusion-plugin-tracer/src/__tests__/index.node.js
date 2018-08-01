// @flow

import test from 'tape-cup';

import {LoggerToken} from 'fusion-tokens';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

import TracerPlugin from '../server.js';
import {TracerToken, TracerConfigToken, InitTracerToken} from '../tokens.js';

const mockLogger = {};
const MockLogger = {
  createChild() {
    return mockLogger;
  },
  log: (msg: any): any => {},
  error: (msg: any): any => {},
  warn: (msg: any): any => {},
  info: (msg: any): any => {},
  verbose: (msg: any): any => {},
  debug: (msg: any): any => {},
  silly: (msg: any): any => {},
};

test('Tracer Plugin Interface', t => {
  t.ok(TracerPlugin, 'exported correctly');
  t.end();
});

test('Tracer Plugin', async t => {
  const config = {
    serviceName: 'uber',
  };

  const mockTracer = {
    close() {
      return true;
    },
  };

  function MockInitTracer(cfg, options) {
    t.looseEquals(cfg, config, 'config is passed down');
    t.looseEquals(
      options,
      {logger: mockLogger},
      'options needs to be passed down'
    );
    return mockTracer;
  }

  const app = new App('el', el => el);
  app.register(LoggerToken, MockLogger);
  app.register(TracerToken, TracerPlugin);
  app.register(InitTracerToken, MockInitTracer);
  app.register(TracerConfigToken, config);
  app.middleware({Tracer: TracerToken}, ({Tracer}) => {
    t.equals(Tracer.tracer, mockTracer, 'should have tracer instance created');
    return (ctx, next) => next();
  });
  getSimulator(app);
  t.end();
});

test('Tracer Middleware', async t => {
  const mockSpan = {
    setTag(key, value) {
      t.equals(key, 'http.status_code', 'should set status code');
      t.equals(value, 200, 'status code should have value');
    },
    finish() {
      t.ok(true, 'span.finish should be called');
      t.end();
    },
  };

  const mockTracer = {
    extract(type, headers) {
      t.equals(
        type,
        'http_headers',
        'extract root span from inbound http headers'
      );
      t.looseEquals(
        headers,
        {'x-uber-source': 'fusion'},
        'headers should be passed as is'
      );
      return 'inbound_context';
    },
    startSpan(name, options) {
      t.equals(name, 'GET_/path', 'span name should match');
      t.looseEquals(
        options.tags,
        {
          component: 'fusion',
          'span.kind': 'server',
          'http.url': '/path',
          'http.method': 'GET',
          'peer.service': 'web_client',
        },
        'span options should match'
      );

      t.equals(options.childOf, 'inbound_context', 'span childOf should match');

      return mockSpan;
    },
  };

  function MockInitTracer() {
    return mockTracer;
  }

  const app = new App('el', el => el);
  app.register(LoggerToken, MockLogger);
  app.register(TracerToken, TracerPlugin);
  app.register(InitTracerToken, MockInitTracer);
  app.middleware({Tracer: TracerToken}, ({Tracer}) => {
    return async (ctx, next) => {
      t.ok(true, 'Next is called');
      t.equals(Tracer.from(ctx).span, mockSpan, 'span should be defined');
      t.equals(
        Tracer.from(ctx).tracer,
        Tracer.tracer,
        'tracer should be defined'
      );
      await next();
      ctx.body = 'Hello world';
    };
  });
  const sim = getSimulator(app);
  await sim.request('/path', {headers: {'x-uber-source': 'fusion'}});
});

test('Tracer Middleware with response set above tracer', async t => {
  const mockSpan = {
    setTag(key, value) {
      t.equals(key, 'http.status_code', 'should set status code');
      t.equals(value, 200, 'status code should have value');
    },
    finish() {
      t.ok(true, 'span.finish should be called');
      t.end();
    },
  };

  const mockTracer = {
    extract(type, headers) {
      t.equals(
        type,
        'http_headers',
        'extract root span from inbound http headers'
      );
      t.looseEquals(
        headers,
        {'x-uber-source': 'fusion'},
        'headers should be passed as is'
      );
      return 'inbound_context';
    },
    startSpan(name, options) {
      t.equals(name, 'GET_/path', 'span name should match');
      t.looseEquals(
        options.tags,
        {
          component: 'fusion',
          'span.kind': 'server',
          'http.url': '/path',
          'http.method': 'GET',
          'peer.service': 'web_client',
        },
        'span options should match'
      );

      t.equals(options.childOf, 'inbound_context', 'span childOf should match');

      return mockSpan;
    },
  };

  function MockInitTracer() {
    return mockTracer;
  }

  const app = new App('el', el => el);
  app.register(LoggerToken, MockLogger);
  app.middleware(async (ctx, next) => {
    await next();
    ctx.body = 'hello';
  });
  app.register(TracerToken, TracerPlugin);
  app.register(InitTracerToken, MockInitTracer);
  const sim = getSimulator(app);
  await sim.request('/path', {headers: {'x-uber-source': 'fusion'}});
});