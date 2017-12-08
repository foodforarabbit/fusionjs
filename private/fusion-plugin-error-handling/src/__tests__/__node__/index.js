/* eslint-env node */

import test from 'tape-cup';
import plugin from '../../server';
process.on('unhandledRejection', e => {
  throw e;
});

test('interface', async t => {
  t.equal(typeof plugin, 'function');
  const Logger = {
    of() {
      return {
        fatal(message, error, cb) {
          t.equal(message, 'error');
          t.equal(error.message, 'error');
          t.equal(error.tags.captureType, 'server', 'tags capture type');
          cb();
        },
      };
    },
  };
  const M3 = {
    of() {
      return {
        immediateIncrement(name, tags, cb) {
          t.equal(name, 'exception');
          t.equal(tags.captureType, 'server');
          cb();
        },
      };
    },
  };
  const CsrfProtection = {
    ignore: {},
  };
  const BasePlugin = async ({onError}) => {
    t.equal(typeof onError, 'function');
    await onError('error', 'server');
    t.end();
  };
  plugin({
    Logger,
    M3,
    BasePlugin,
    CsrfProtection,
    logTimeout: 10,
    m3Timeout: 10,
  });
});

test('logger timeout', async t => {
  const Logger = {
    of() {
      return {
        fatal() {},
      };
    },
  };
  const M3 = {
    of() {
      return {
        immediateIncrement(name, tags, cb) {
          cb();
        },
      };
    },
  };
  const CsrfProtection = {
    ignore: {},
  };
  const BasePlugin = async ({onError}) => {
    t.equal(typeof onError, 'function');
    await onError('error', 'server');
    t.end();
  };
  plugin({
    Logger,
    M3,
    BasePlugin,
    CsrfProtection,
    logTimeout: 10,
    m3Timeout: 10,
  });
});

test('m3 timeout', async t => {
  const Logger = {
    of() {
      return {
        fatal(message, e, cb) {
          cb();
        },
      };
    },
  };
  const M3 = {
    of() {
      return {
        immediateIncrement() {},
      };
    },
  };
  const CsrfProtection = {
    ignore: {},
  };
  const BasePlugin = async ({onError}) => {
    t.equal(typeof onError, 'function');
    await onError('error', 'server');
    t.end();
  };
  plugin({
    Logger,
    M3,
    BasePlugin,
    CsrfProtection,
    logTimeout: 10,
    m3Timeout: 10,
  });
});
