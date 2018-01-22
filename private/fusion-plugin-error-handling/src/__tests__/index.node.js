/* eslint-env node */

import test from 'tape-cup';
import App from 'fusion-core';
import {LoggerToken, createToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {getSimulator} from 'fusion-test-utils';
import plugin from '../server';

const ErrorToken = createToken('ErrorHandler');

process.on('unhandledRejection', e => {
  throw e;
});

test('interface', async t => {
  let calledLogger = false;
  let calledM3 = false;
  const Logger = {
    fatal(message, error, cb) {
      t.equal(message, 'error');
      t.equal(error.message, 'error');
      t.equal(error.tags.captureType, 'server', 'tags capture type');
      calledLogger = true;
      cb();
    },
  };
  const M3 = {
    immediateIncrement(name, tags, cb) {
      t.equal(name, 'exception');
      t.equal(tags.captureType, 'server');
      calledM3 = true;
      cb();
    },
  };
  const app = new App('el', el => el);
  app.register(M3Token, M3);
  app.register(LoggerToken, Logger);
  app.register(ErrorToken, plugin);
  app.middleware({errorHandler: ErrorToken}, ({errorHandler}) => {
    return async (ctx, next) => {
      await errorHandler('error', 'server');
      return next();
    };
  });
  const sim = getSimulator(app);
  await sim.request('/');
  t.ok(calledLogger);
  t.ok(calledM3);
  t.end();
});
