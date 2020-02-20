// @flow
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import Plugin from '../src/browser';
import {supportedLevels} from '../src/constants';

test('test all methods exist for browser', done => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, {});
  app.middleware({logger: LoggerToken}, ({logger}) => {
    supportedLevels.concat(['log']).forEach(fn => {
      // $FlowFixMe - Logtron has methods that the LoggerToken does not.
      expect(typeof logger[fn]).toBe('function');
    });
    done();
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('test info method', done => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, {
    emit: () => {},
  });
  app.middleware({logger: LoggerToken}, ({logger}) => {
    expect(typeof logger.info).toBe('function');
    expect(() => logger.info('hello world', {some: 'data'})).not.toThrow();
    done();
    return (ctx, next) => next();
  });
  getSimulator(app);
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
  app.middleware({logger: LoggerToken}, ({logger}) => {
    logger.info(new Error('some error'));
    return (ctx, next) => next();
  });
  getSimulator(app);
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
  app.middleware({logger: LoggerToken}, ({logger}) => {
    logger.info('hello world', new Error('some error'));
    return (ctx, next) => next();
  });
  getSimulator(app);
});
