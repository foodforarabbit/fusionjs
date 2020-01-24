// @flow
/* eslint-env node */

import App from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {getSimulator} from 'fusion-test-utils';
import plugin from '../server';
import {ErrorHandlerToken} from 'fusion-plugin-error-handling';

process.on('unhandledRejection', e => {
  throw e;
});

const setupApp = async (Logger, M3, errorType) => {
  const app = new App('el', el => el);
  // $FlowFixMe
  app.register(M3Token, M3);
  // $FlowFixMe
  app.register(LoggerToken, Logger);
  app.register(ErrorHandlerToken, plugin);
  app.middleware({errorHandler: ErrorHandlerToken}, ({errorHandler}) => {
    return async (ctx, next) => {
      await errorHandler(new Error('error'), errorType);
      return next();
    };
  });
  const sim = getSimulator(app);
  await sim.request('/');
};

test('interface', async () => {
  let calledLogger = false;
  let calledM3 = false;
  const Logger = {
    error(message, error, cb) {
      expect(message).toBe('error');
      expect(error.message).toBe('error');
      expect(error.tags.captureType).toBe('server');
      expect(error.tags.captureSource).toBe('server');
      expect(error.tags.framework).toBe('fusion');
      calledLogger = true;
      cb();
    },
  };
  const M3 = {
    immediateIncrement(name, tags) {
      expect(name).toBe('exception');
      expect(tags.captureType).toBe('server');
      calledM3 = true;
    },
  };
  await setupApp(Logger, M3, 'server');
  expect(calledLogger).toBeTruthy();
  expect(calledM3).toBeTruthy();
});

test('test captureSource, framework', async () => {
  let calledLogger = false;
  let calledM3 = false;
  const Logger = {
    error(message, error, cb) {
      expect(message).toBe('error');
      expect(error.message).toBe('error');
      expect(error.tags.captureType).toBe('browser');
      expect(error.tags.captureSource).toBe('client');
      expect(error.tags.framework).toBe('fusion');
      calledLogger = true;
      cb();
    },
  };
  const M3 = {
    immediateIncrement(name, tags) {
      expect(name).toBe('exception');
      expect(tags.captureType).toBe('browser');
      calledM3 = true;
    },
  };
  await setupApp(Logger, M3, 'browser');
  expect(calledLogger).toBeTruthy();
  expect(calledM3).toBeTruthy();
});
