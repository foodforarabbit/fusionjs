// @flow
import tape from 'tape-cup';
import App from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {getSimulator} from 'fusion-test-utils';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {spy} from 'sinon';
import Plugin, {handleLog, TeamToken} from '../server';
import {supportedLevels} from '../constants';
import TestEmitter from './test-emitter';

import type {Logger as LoggerType} from 'fusion-tokens';

tape('test all methods exist for server', t => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(M3Token, {});
  // $FlowFixMe
  app.register(UniversalEventsToken, {});
  app.register(TeamToken, 'team');
  app.middleware({logger: LoggerToken}, ({logger}) => {
    supportedLevels.concat(['log']).forEach(fn => {
      t.equal(typeof logger[fn], 'function', `${fn} was set`);
    });
    t.end();
    return (ctx, next) => next();
  });
  getSimulator(app);
});

tape('server plugin basic creation', t => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(M3Token, {});
  // $FlowFixMe
  app.register(UniversalEventsToken, {});
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
  t.ok(loggerMock.error.called, 'logger.error was called');
  t.end();
});

tape('server test handleLog with invalid payload message', t => {
  const loggerMock = {
    error: spy(),
  };

  // $FlowFixMe - missing logger methods in mock
  handleLog(loggerMock, function() {}, {
    level: 'error',
    message: {},
  });
  t.ok(loggerMock.error.called, 'logger.error was called');
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

tape('server test log method', t => {
  const emitter = new TestEmitter();

  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(M3Token, {});
  // $FlowFixMe
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.middleware({logger: LoggerToken}, ({logger}) => {
    emitter.on('logtron:log', () => {
      t.pass('emitter called when log was called');
      t.end();
    });
    logger.log('error', {});
    return (ctx, next) => next();
  });
  getSimulator(app);
});
