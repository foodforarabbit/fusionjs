// @flow

import {LoggerToken} from 'fusion-tokens';
import App, {RouteTagsToken} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

import TracerPlugin from '../server.js';
import {TracerToken, TracerConfigToken, InitTracerToken} from '../tokens.js';

const MockLogger = {
  createChild() {
    return MockLogger;
  },
  log: (msg: any): any => {},
  error: (msg: any): any => {},
  warn: (msg: any): any => {},
  info: (msg: any): any => {},
  verbose: (msg: any): any => {},
  debug: (msg: any): any => {},
  silly: (msg: any): any => {},
};

test('Tracer Plugin Interface', () => {
  expect(TracerPlugin).toBeTruthy();
});

test('Tracer Plugin', async () => {
  const config = {
    serviceName: 'uber',
  };

  const mockTracer = {
    close() {
      return true;
    },
  };

  function MockInitTracer(cfg, options): any {
    expect(cfg).toStrictEqual(config);
    expect(options).toStrictEqual({logger: MockLogger});

    return mockTracer;
  }

  const app = new App('el', el => el);
  app.register(LoggerToken, MockLogger);
  app.register(TracerToken, TracerPlugin);
  app.register(InitTracerToken, MockInitTracer);
  app.register(TracerConfigToken, config);
  app.middleware({Tracer: TracerToken}, ({Tracer}) => {
    expect(Tracer.tracer).toBe(mockTracer);
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('Tracer Middleware', async done => {
  const mockSpan = {
    setTag(key, value) {
      expect(key).toBe('http.status_code');
      expect(value).toBe(200);
    },
    finish() {
      expect(true).toBeTruthy();
      done();
    },
    setOperationName(name) {
      expect(name).toBe('route_name');
    },
  };

  const mockTracer = {
    extract(type, headers) {
      expect(type).toBe('http_headers');
      expect(headers).toStrictEqual({'x-uber-source': 'fusion'});
      return 'inbound_context';
    },
    startSpan(name, options) {
      expect(name).toBe('unknown_route');
      expect(options.tags).toStrictEqual({
        component: 'fusion',
        'span.kind': 'server',
        'http.url': '/path',
        'http.method': 'GET',
        'peer.service': 'web_client',
      });

      expect(options.childOf).toBe('inbound_context');

      return mockSpan;
    },
    setOperationName(name) {
      expect(name).toBe('route_name');
    },
  };

  function MockInitTracer(): any {
    return mockTracer;
  }

  const app = new App('el', el => el);
  app.register(LoggerToken, MockLogger);
  app.register(TracerToken, TracerPlugin);
  app.register(InitTracerToken, MockInitTracer);
  app.middleware({Tracer: TracerToken}, ({Tracer}) => {
    return async (ctx, next) => {
      expect(true).toBeTruthy();
      expect(Tracer.from(ctx).span).toBe(mockSpan);
      expect(Tracer.from(ctx).tracer).toBe(Tracer.tracer);
      await next();
      ctx.body = 'Hello world';
    };
  });
  app.middleware(
    {RouteTags: RouteTagsToken},
    ({RouteTags}) => async (ctx, next) => {
      await next();
      RouteTags.from(ctx).name = 'route_name';
    }
  );
  const sim = getSimulator(app);
  await sim.request('/path', {headers: {'x-uber-source': 'fusion'}});
});

test('Tracer Middleware with response set above tracer', async done => {
  const mockSpan = {
    setTag(key, value) {
      expect(key).toBe('http.status_code');
      expect(value).toBe(200);
    },
    finish() {
      expect(true).toBeTruthy();
      done();
    },
    setOperationName(name) {
      expect(name).toBe('route_name');
    },
  };

  const mockTracer = {
    extract(type, headers) {
      expect(type).toBe('http_headers');
      expect(headers).toStrictEqual({'x-uber-source': 'fusion'});
      // 'headers should be passed as is'
      // );
      return 'inbound_context';
    },
    startSpan(name, options) {
      expect(name).toBe('unknown_route');
      expect(options.tags).toStrictEqual(
        {
          component: 'fusion',
          'span.kind': 'server',
          'http.url': '/path',
          'http.method': 'GET',
          'peer.service': 'web_client',
        }
        // 'span options should match'
      );

      expect(options.childOf).toBe('inbound_context');

      return mockSpan;
    },
  };

  function MockInitTracer(): any {
    return mockTracer;
  }

  const app = new App('el', el => el);
  app.register(LoggerToken, MockLogger);
  app.middleware(
    {RouteTags: RouteTagsToken},
    ({RouteTags}) => async (ctx, next) => {
      RouteTags.from(ctx).name = 'route_name';
      return next();
    }
  );
  app.middleware(async (ctx, next) => {
    await next();
    ctx.body = 'hello';
  });
  app.register(TracerToken, TracerPlugin);
  app.register(InitTracerToken, MockInitTracer);
  const sim = getSimulator(app);
  await sim.request('/path', {headers: {'x-uber-source': 'fusion'}});
});
