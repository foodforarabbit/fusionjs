// @flow
/* eslint-env node */

import test from 'tape-cup';
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

test('interface', async t => {
  let calledLogger = false;
  let calledM3 = false;
  const Logger = {
    error(message, error, cb) {
      t.equal(message, 'error');
      t.equal(error.message, 'error');
      t.equal(error.tags.captureType, 'server', 'tags capture type');
      t.equal(error.tags.captureSource, 'server');
      t.equal(error.tags.framework, 'fusion');
      calledLogger = true;
      cb();
    },
  };
  const M3 = {
    immediateIncrement(name, tags) {
      t.equal(name, 'exception');
      t.equal(tags.captureType, 'server');
      calledM3 = true;
    },
  };
  await setupApp(Logger, M3, 'server');
  t.ok(calledLogger);
  t.ok(calledM3);
  t.end();
});

test('test captureSource, framework', async t => {
  let calledLogger = false;
  let calledM3 = false;
  const Logger = {
    error(message, error, cb) {
      t.equal(message, 'error');
      t.equal(error.message, 'error');
      t.equal(error.tags.captureType, 'browser', 'tags capture type');
      t.equal(error.tags.captureSource, 'client');
      t.equal(error.tags.framework, 'fusion');
      calledLogger = true;
      cb();
    },
  };
  const M3 = {
    immediateIncrement(name, tags) {
      t.equal(name, 'exception');
      t.equal(tags.captureType, 'browser');
      calledM3 = true;
    },
  };
  await setupApp(Logger, M3, 'browser');
  t.ok(calledLogger);
  t.ok(calledM3);
  t.end();
});
