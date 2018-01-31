import test from 'tape-cup';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken, createToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import GalileoPlugin, {ClientToken, ConfigToken} from '../server';

const mockLogger = {
  createChild: () => 'logger',
};
const mockM3 = 'm3';
const mockTracer = {tracer: 'tracer'};

test('Galileo Plugin', t => {
  t.ok(GalileoPlugin, 'exported correctly');
  t.end();
});

test('fusion Galileo Plugin', t => {
  const config = {
    test: 'test',
  };

  function MockGalileo(cfg, tracer, format, logger, m3) {
    t.looseEquals(
      cfg,
      {
        appName: 'dev-service',
        galileo: {
          enabled: true,
          test: 'test',
        },
      },
      'config is passed down'
    );
    t.equal(tracer, 'tracer', 'tracer instance needs to be passed down');
    t.equal(m3, 'm3', 'm3 needs to be passed down');
    t.equal(logger, 'logger', 'logger instance needs to be passed down');
    t.equal(format, 'http_headers', 'format needs to be passed down');
    return {};
  }

  const gToken = createToken('Galileo');
  const app = new App('el', el => el);
  app.register(LoggerToken, mockLogger);
  app.register(M3Token, mockM3);
  app.register(TracerToken, mockTracer);
  app.register(ClientToken, MockGalileo);
  app.register(ConfigToken, config);
  app.register(gToken, GalileoPlugin);
  app.middleware({Galileo: gToken}, ({Galileo}) => {
    t.ok(Galileo.galileo, 'should have galileo instance created');
    t.ok(Galileo.destroy(), 'should destory the galileo instance');
    return (ctx, next) => next();
  });
  getSimulator(app);
  t.end();
});
