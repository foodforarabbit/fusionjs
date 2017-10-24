import test from 'tape-cup';
import GalileoPlugin from '../../server';

const mockTracer = {
  client() {
    return {tracer: true};
  }
};
const mockLogger = {};

const MockTracer = {
  of() {
    return mockTracer;
  },
};

const MockLogger = {
  of() {
    return {
      createChild() {
        return mockLogger;
      },
    };
  },
};

test('Galileo Plugin', t => {
  t.ok(GalileoPlugin, 'exported correctly');
  t.end();
});

test('Graphene Galileo Plugin', t => {
  const config = {
    appName: 'uber',
    galileo: {test: 'test'},
  };

  function MockGalileo(cfg, tracer, format, logger) {
    t.looseEquals(cfg, config, 'config is passed down');
    t.looseEquals(tracer, {tracer: true}, 'tracer instance needs to be passed down');
    t.equals(logger, mockLogger, 'logger instance needs to be passed down');
    t.equals(format, 'http_headers', 'format needs to be passed down');
    return {};
  }

  const Galileo = GalileoPlugin({
    Logger: MockLogger,
    Tracer: MockTracer,
    GalileoClient: MockGalileo,
    config,
  });
  t.ok(typeof Galileo, 'function', 'exposes a function');
  t.ok(Galileo.of().client(), 'should have galileo instance created');
  t.ok(Galileo.of().destroy(), 'should destory the galileo instance');

  t.end();
});
