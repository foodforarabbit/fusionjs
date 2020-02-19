// @flow
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import Plugin from '../browser';
import {supportedLevels} from '../constants';
import TestEmitter from './test-emitter';

const emitter = new TestEmitter();

test('test all methods exist for browser', () => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, emitter);
  // $FlowFixMe - Dummy M3 Token.
  app.register(M3Token, {});
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  supportedLevels.concat(['log']).forEach(fn => {
    // $FlowFixMe - Logger has methods that the LoggerToken does not.
    expect(typeof logger[fn]).toBe('function');
  });
});

test('test info method', () => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, emitter);
  // $FlowFixMe - Dummy M3 Token.
  app.register(M3Token, {});
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  expect(typeof logger.info).toBe('function');
  expect(() => logger.info('hello world', {some: 'data'})).not.toThrow();
});

test('test info method with message of an error', done => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, {
    emit: (scope, params) => {
      expect(typeof params.meta.error).toBe('object');
      done();
    },
  });
  // $FlowFixMe - Dummy M3 Token.
  app.register(M3Token, {});
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  logger.info(new Error('some error'));
});

test('test info method with meta of an error', done => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, {
    emit: (scope, params) => {
      expect(typeof params.meta.error).toBe('object');
      done();
    },
  });
  // $FlowFixMe - Dummy M3 Token.
  app.register(M3Token, {});
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  logger.info('hello world', new Error('some error'));
});
