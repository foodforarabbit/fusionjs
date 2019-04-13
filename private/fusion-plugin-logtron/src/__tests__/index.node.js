// @flow
import tape from 'tape-cup';
import App from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {getSimulator} from 'fusion-test-utils';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {spy} from 'sinon';
import Plugin, {handleLog} from '../server';
import {TeamToken} from '../tokens';
import {supportedLevels} from '../constants';
import TestEmitter from './test-emitter';

import type {Logger as LoggerType} from 'fusion-tokens';

tape('test all methods exist for server', t => {
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
      t.equal(typeof logger[fn], 'function', `${fn} was set`);
      // $FlowFixMe
      t.equal(typeof child[fn], 'function', `${fn} was set on child logger`);
    });
    t.end();
    return (ctx, next) => next();
  });
  getSimulator(app);
});

tape('server plugin basic creation', t => {
  const emitter = new TestEmitter();
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(M3Token, {});
  // $FlowFixMe
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.middleware({logger: LoggerToken}, ({logger}) => {
    t.equal(typeof logger.info, 'function', 'exposes logger functions');
    t.doesNotThrow(
      () => logger.info('hello world', {some: 'data'}),
      'does not throw when logging'
    );
    t.end();
    return (ctx, next) => next();
  });
  getSimulator(app);
});

tape('server test handleLog with valid payload', t => {
  const loggerMock = {
    error: spy(),
  };

  // $FlowFixMe - missing logger methods in mock
  handleLog(loggerMock, function() {}, {
    level: 'error',
    message: 'hello world',
  });
  t.ok(loggerMock.error.called, 'logger.error was called');
  t.end();
});

tape('server test handleLog with invalid payload', t => {
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
  t.ok(loggerMock.error.called, 'logger.error was called');
  t.end();
});

tape('server test handleLog object message', t => {
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
  t.notok(loggerMock.error.called, 'logger.error was not called');
  t.ok(loggerMock.info.called, 'calls info');
  t.equal(
    loggerMock.info.getCall(0).args[0],
    '',
    'calls with empty string for message'
  );
  t.equal(
    loggerMock.info.getCall(0).args[1],
    message,
    'uses object message as meta'
  );
  t.end();
});

tape('server test handleLog with object message and meta', t => {
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
  t.notok(loggerMock.error.called, 'logger.error was not called');
  t.ok(loggerMock.info.called, 'calls info');
  t.equal(
    loggerMock.info.getCall(0).args[0],
    '',
    'calls with empty string for message'
  );
  t.equal(loggerMock.info.getCall(0).args[1], meta, 'uses meta as meta');
  t.end();
});

tape('server test handleLog with null message and object meta', t => {
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
  t.notok(loggerMock.error.called, 'logger.error was not called');
  t.ok(loggerMock.info.called, 'calls info');
  t.equal(
    loggerMock.info.getCall(0).args[0],
    '',
    'calls with empty string for message'
  );
  t.equal(loggerMock.info.getCall(0).args[1], meta, 'uses meta as meta');
  t.end();
});

tape('server test handleLog with invalid level', t => {
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
  t.ok(loggerMock.error.called, 'logger.error called');
  t.notok(loggerMock.info.called, 'does not call info');
  t.end();
});

tape('server test handleLog with error set in meta', async t => {
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
  t.ok(loggerMock.error.called, 'logger.error was called');
  t.end();
});

tape('server test log methods', t => {
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
    t.equal(emitterCalls, 7);
    t.end();
    return (ctx, next) => next();
  });
  getSimulator(app);
});
