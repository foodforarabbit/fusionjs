// @flow
import App from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {getSimulator} from 'fusion-test-utils';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {spy} from 'sinon';
import Plugin, {handleLog} from '../src/server';
import {TeamToken} from '../src/tokens';
import {supportedLevels} from '../src/constants';
import TestEmitter from './test-emitter';

import type {Logger as LoggerType} from 'fusion-tokens';

test('test all methods exist for server', done => {
  const emitter = new TestEmitter();
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(M3Token, {});
  // $FlowFixMe
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.middleware({logger: LoggerToken}, ({logger}) => {
    // Logtron has some additional logging methods not present in the LoggerToken interface such as createChild, trace, access, and fatal.
    // We keep these around for compatiblity with libraries and existing code.
    // $FlowFixMe
    const child = logger.createChild('test-child');
    supportedLevels.concat(['log']).forEach(fn => {
      // $FlowFixMe
      expect(typeof logger[fn]).toBe('function');
      // $FlowFixMe
      expect(typeof child[fn]).toBe('function');
    });
    done();
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('server plugin basic creation', done => {
  const emitter = new TestEmitter();
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(M3Token, {});
  // $FlowFixMe
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.middleware({logger: LoggerToken}, ({logger}) => {
    expect(typeof logger.info).toBe('function');
    expect(() => logger.info('hello world', {some: 'data'})).not.toThrow();
    done();
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('server test handleLog with valid payload', () => {
  const loggerMock = {
    error: spy(),
  };

  // $FlowFixMe - missing logger methods in mock
  handleLog(loggerMock, function() {}, {
    level: 'error',
    message: 'hello world',
  });
  expect(loggerMock.error.called).toBeTruthy();
});

test('server test handleLog with invalid payload', () => {
  // $FlowFixMe - missing logger methods in mock
  const loggerMock: LoggerType = {
    error: spy(),
  };

  handleLog(
    loggerMock,
    function() {
      return {};
    },
    {message: '', level: '', meta: {}}
  );
  // $FlowFixMe - called is only used for testing
  expect(loggerMock.error.called).toBeTruthy();
});

test('server test handleLog object message', () => {
  const loggerMock = {
    error: spy(),
    info: spy(),
  };
  const message = {
    test: 'test',
  };

  // $FlowFixMe - missing logger methods in mock
  handleLog(loggerMock, function() {}, {
    level: 'info',
    message,
  });
  expect(loggerMock.error.called).toBeFalsy();
  expect(loggerMock.info.called).toBeTruthy();
  expect(loggerMock.info.getCall(0).args[0]).toBe('');
  expect(loggerMock.info.getCall(0).args[1]).toBe(message);
});

test('server test handleLog with object message and meta', () => {
  const loggerMock = {
    error: spy(),
    info: spy(),
  };
  const message = {
    test: 'test',
  };
  const meta = {
    a: 'b',
  };

  // $FlowFixMe - missing logger methods in mock
  handleLog(loggerMock, function() {}, {
    level: 'info',
    message,
    meta,
  });
  expect(loggerMock.error.called).toBeFalsy();
  expect(loggerMock.info.called).toBeTruthy();
  expect(loggerMock.info.getCall(0).args[0]).toBe('');
  expect(loggerMock.info.getCall(0).args[1]).toBe(meta);
});

test('server test handleLog with null message and object meta', () => {
  const loggerMock = {
    error: spy(),
    info: spy(),
  };
  const message = null;
  const meta = {
    a: 'b',
  };

  // $FlowFixMe - missing logger methods in mock
  handleLog(loggerMock, function() {}, {
    level: 'info',
    message,
    meta,
  });
  expect(loggerMock.error.called).toBeFalsy();
  expect(loggerMock.info.called).toBeTruthy();
  expect(loggerMock.info.getCall(0).args[0]).toBe('');
  expect(loggerMock.info.getCall(0).args[1]).toBe(meta);
});

test('server test handleLog with invalid level', () => {
  const loggerMock = {
    error: spy(),
    info: spy(),
  };
  const message = 'test';
  const meta = {
    a: 'b',
  };

  // $FlowFixMe - missing logger methods in mock
  handleLog(loggerMock, function() {}, {
    level: 'invalid',
    message,
    meta,
  });
  expect(loggerMock.error.called).toBeTruthy();
  expect(loggerMock.info.called).toBeFalsy();
});

test('server test handleLog with error set in meta', async () => {
  const loggerMock = {
    error: spy(),
  };

  await handleLog(
    // $FlowFixMe
    loggerMock,
    function() {
      return Promise.resolve({});
    },
    {
      level: 'error',
      message: 'hello world',
      meta: {
        error: {
          stack: [],
        },
      },
    }
  );
  expect(loggerMock.error.called).toBeTruthy();
});

test('server test log methods', done => {
  const emitter = new TestEmitter();

  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(M3Token, {});
  // $FlowFixMe
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.middleware({logger: LoggerToken}, ({logger}) => {
    let emitterCalls = 0;
    emitter.on('logtron:log', () => {
      emitterCalls += 1;
    });
    logger.log('error', 'message', {});
    logger.error('message', {});
    logger.warn('message', {});
    logger.info('message', {});
    logger.debug('message', {});
    logger.silly('message', {});
    logger.verbose('message', {});
    expect(emitterCalls).toBe(7);
    done();
    return (ctx, next) => next();
  });
  getSimulator(app);
});
