import test from 'tape-cup';
import TracerPlugin from '../../server';

const mockLogger = {};

const MockLogger = {
  of() {
    return {
      createChild() {
        return mockLogger;
      },
    };
  },
};

test('Tracer Plugin Interface', t => {
  t.ok(TracerPlugin, 'exported correctly');
  t.end();
});

test('Tracer Plugin', t => {
  const config = {
    appName: 'uber',
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

  const Tracer = TracerPlugin({
    Logger: MockLogger,
    initClient: MockInitTracer,
    config,
  });

  t.ok(typeof Tracer, 'function', 'exposes a function');
  t.equals(
    Tracer.of().tracer,
    mockTracer,
    'should have tracer instance created'
  );
  t.ok(Tracer.destroy(), 'should destroy the tracer instance');

  t.end();
});

test('Tracer Middleware', t => {
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
        {'x-uber-source': 'graphene'},
        'headers should be passed as is'
      );
      return 'inbound_context';
    },
    startSpan(name, options) {
      t.equals(name, 'GET_/path', 'span name should match');
      t.looseEquals(
        options.tags,
        {
          component: 'graphene',
          'span.kind': 'server',
          'http.url': '/path',
          'http.method': 'GET',
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

  const Tracer = TracerPlugin({
    Logger: MockLogger,
    initClient: MockInitTracer,
    config: {},
  });

  const ctx = {
    request: {
      path: '/path',
      headers: {'x-uber-source': 'graphene'},
      method: 'GET',
    },
    response: {status: 200},
  };

  Tracer.middleware.call(Tracer, ctx, () => {
    t.ok(true, 'Next is called');
    t.equals(Tracer.of(ctx).span, mockSpan, 'span should be defined');
    t.equals(
      Tracer.of(ctx).tracer,
      Tracer.of().tracer,
      'tracer should be defined'
    );
    t.notOk(Tracer.of().span, 'global tracer should not have span');
  });
});
