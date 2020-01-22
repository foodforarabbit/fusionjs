// @flow
import tape from 'tape-cup';
import App from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
// import {M3Token} from '@uber/fusion-plugin-m3';
import {getSimulator} from 'fusion-test-utils';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {spy} from 'sinon';

import type {PayloadMetaType} from '../types';
import Plugin, {handleLog} from '../server';
import {TeamToken, EnvOverrideToken} from '../tokens';
import {supportedLevels} from '../constants';
import createErrorTransform from '../utils/create-error-transform';
import {prettify} from '../utils/format-stdout';
import TestEmitter from './test-emitter';

const transformError = createErrorTransform(); // ignore source maps

tape('supports all logger methods in production', t => {
  const emitter = new TestEmitter();

  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe - TestEmitter is only a partial implementation.
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.register(EnvOverrideToken, 'production');
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  t.plan(4 * (supportedLevels.length + 1) + 1);
  const message = 'this is a message';
  // $FlowFixMe - Logger has methods that the LoggerToken does not.
  const child = logger.createChild('test-child');

  let formatPattern;

  // Supported level methods
  supportedLevels.forEach(fn => {
    // $FlowFixMe - Logger has methods that the LoggerToken does not.
    t.equal(typeof logger[fn], 'function', `${fn} was set`);
    t.equal(typeof child[fn], 'function', `${fn} was set on child logger`);
    const consoleSpy = spy(console, 'log');
    t.doesNotThrow(
      // $FlowFixMe - Logger has methods that the LoggerToken does not.
      () => logger[fn](message, {a: {b: {c: 3}}}, () => {}),
      'does not throw when logging'
    );

    formatPattern = new RegExp(
      `\\"level\\"\\:\\"${fn}\\".*\\"msg\\"\\:\\"${message}\\".*\\"fields\\"\\:`
    ); // based on `utils/format-stdout.js`

    t.ok(
      consoleSpy.calledWithMatch(formatPattern),
      'logs normally with valid payload'
    );
    consoleSpy.restore();
  });

  // `log` method
  // $FlowFixMe - Logger has methods that the LoggerToken does not.
  t.equal(typeof logger.log, 'function', `'log' was set`);
  t.equal(typeof child.log, 'function', `'log' was set on child logger`);
  const consoleSpy = spy(console, 'log');
  t.doesNotThrow(
    () => logger.log('info', message, {a: {b: {c: 3}}}, () => {}),
    'does not throw when logging'
  );

  formatPattern = new RegExp(
    `\\"level\\"\\:\\"info\\".*\\"msg\\"\\:\\"${message}\\".*\\"fields\\"\\:`
  ); // based on `utils/format-stdout.js`

  t.ok(
    consoleSpy.calledWithMatch(formatPattern),
    'logs normally with valid payload'
  );
  consoleSpy.restore();

  // unsupported method
  t.throws(
    () =>
      // $FlowFixMe - LoggerToken does not support unavaialable method `lol`
      logger.lol(message, {a: {b: {c: 3}}}, () => {}),
    'throws when logging unsupported method'
  );
  t.end();
});

tape('supports all logger methods in development', t => {
  const emitter = new TestEmitter();

  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe - TestEmitter is only a partial implementation.
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.register(EnvOverrideToken, 'dev');
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  t.plan(2 * (supportedLevels.length + 1));
  const message = 'this is a message';
  const meta = {a: {aa: {aaa: 3}}, b: 5, c: 'hi'};

  let formatPattern;

  // Supported level methods
  supportedLevels.forEach(fn => {
    const consoleSpy = spy(console, 'log');
    t.doesNotThrow(
      // $FlowFixMe - Logger has methods that the LoggerToken does not.
      () => logger[fn](message, meta, () => {}),
      'does not throw when logging'
    );

    formatPattern = new RegExp(`${fn}\\:?.*${message}.*${prettify(meta)}`); // based on `utils/format-stdout.js`

    t.ok(
      consoleSpy.calledWithMatch(formatPattern),
      'logs normally with valid payload'
    );
    consoleSpy.restore();
  });

  // `log` method
  const consoleSpy = spy(console, 'log');
  t.doesNotThrow(
    () => logger.log('info', message, meta, () => {}),
    'does not throw when logging'
  );

  formatPattern = new RegExp(`info\\:.*${message}.*${prettify(meta)}`); // based on `utils/format-stdout.js`

  t.ok(
    consoleSpy.calledWithMatch(formatPattern),
    'logs normally with valid payload'
  );
  consoleSpy.restore();

  t.end();
});

tape('handleLog recognizes meta objects sent as messages in production', t => {
  const emitter = new TestEmitter();

  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe - TestEmitter is only a partial implementation.
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.register(EnvOverrideToken, 'production');
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  t.plan(2 * (supportedLevels.length + 1));
  const message = {a: {b: {c: 3}}};

  let formatPattern;

  // Supported level methods
  supportedLevels.forEach(fn => {
    const consoleSpy = spy(console, 'log');
    t.doesNotThrow(
      // $FlowFixMe - Logger has methods that the LoggerToken does not.
      () => logger[fn](message, {a: {b: {c: 3}}}, () => {}),
      'does not throw when meta object sent as message'
    );

    formatPattern = new RegExp(
      `\\"level\\"\\:\\"${fn}\\".*\\"msg\\"\\:\\"\\".*\\"fields\\"\\:${JSON.stringify(
        message
      )}`
    ); // based on `utils/format-stdout.js`

    t.ok(
      consoleSpy.calledWithMatch(formatPattern),
      'logs normally when meta object sent as message'
    );
    consoleSpy.restore();
  });

  // `log` method
  const consoleSpy = spy(console, 'log');
  t.doesNotThrow(
    // $FlowFixMe - message argument intentionally misused.
    () => logger.log('info', message, '', () => {}),
    'does not throw when meta object sent as message'
  );

  formatPattern = new RegExp(
    `\\"level\\"\\:\\"info\\".*\\"msg\\"\\:\\"\\".*\\"fields\\"\\:${JSON.stringify(
      message
    )}`
  ); // based on `utils/format-stdout.js`

  t.ok(
    consoleSpy.calledWithMatch(formatPattern),
    'logs normally when meta object sent as message'
  );
  consoleSpy.restore();

  t.end();
});

tape(
  'logs partial data when level is valid but arguments incomplete in production',
  t => {
    const emitter = new TestEmitter();

    const app = new App('el', el => el);
    app.register(LoggerToken, Plugin);
    // $FlowFixMe - TestEmitter is only a partial implementation.
    app.register(UniversalEventsToken, emitter);
    app.register(TeamToken, 'team');
    app.register(EnvOverrideToken, 'production');
    app.middleware({logger: LoggerToken}, ({logger}) => {
      t.plan(2 * (supportedLevels.length + 1));
      const message = '123';

      let formatPattern;

      // Supported level methods
      supportedLevels.forEach(fn => {
        const consoleSpy = spy(console, 'log');
        t.doesNotThrow(
          // $FlowFixMe - Logger has methods that the LoggerToken does not.
          () => logger[fn](message),
          'does not throw when logging with incomplete arguments'
        );

        formatPattern = new RegExp(
          `^(?!.*fields.*).*\\"level\\"\\:\\"${fn}\\".*\\"msg\\"\\:\\"${message}\\".*$`
        ); // based on `utils/format-stdout.js`

        t.ok(
          consoleSpy.calledWithMatch(formatPattern),
          'logs normally with incomplete arguments'
        );
        consoleSpy.restore();
      });

      // `log` method
      const consoleSpy = spy(console, 'log');
      t.doesNotThrow(
        () => logger.log('info', message),
        'does not throw when logging with incomplete arguments'
      );

      formatPattern = new RegExp(
        `^(?!.*fields.*).*\\"level\\"\\:\\"info\\".*\\"msg\\"\\:\\"${message}\\".*$`
      ); // based on `utils/format-stdout.js`

      t.ok(
        consoleSpy.calledWithMatch(formatPattern),
        'logs normally with incomplete arguments'
      );
      consoleSpy.restore();

      t.end();
      return (ctx, next) => next();
    });
    getSimulator(app);
  }
);

tape(
  'handleLog calls sentry for errors a) where `meta.error` is an error-like object in production',
  t => {
    t.plan(3);
    const mockLogger = {
      log: (type, meta) => {
        t.ok(type === 'error', 'logs as an error');
        t.ok(typeof meta === 'object', 'passes `meta` as an object');
        t.deepEqual(
          meta,
          {
            error: {message: 'all gone wrong', stack: 'this: 123, that: 324'},
            message: 'all gone wrong',
            stack: 'this: 123, that: 324',
          },
          'error details are hoisted'
        );
        t.end();
      },
    };

    const message = 'all gone wrong';

    // $FlowFixMe - missing logger methods in mock
    handleLog({
      transformError,
      payload: {
        level: 'error',
        message,
        meta: {error: {message, stack: 'this: 123, that: 324'}},
      },
      sentryLogger: mockLogger,
      env: 'production',
    });
  }
);

tape(
  'handleLog calls sentry for errors b) where `meta.error` is a real error, and passing a callback in production',
  t => {
    t.plan(5);

    const message = 'all gone wrong';
    const error = new Error(message);

    const callback = thisError => {
      t.pass('callback is called');
      t.ok((thisError = error), 'callback is logged with error');
    };

    const mockLogger = {
      log: (type, meta: PayloadMetaType) => {
        t.ok(type === 'error', 'logs as an error');
        t.ok(
          {}.toString.call(meta.error) === '[object Error]' ||
            meta.error instanceof Error,
          'Error instance is preseved'
        );
        t.ok(
          'error' in meta && 'stack' in meta && meta.message === message,
          'error details are hoisted'
        );
        t.end();
      },
    };

    // $FlowFixMe - missing logger methods in mock
    handleLog({
      transformError,
      payload: {
        level: 'error',
        message,
        meta: {error},
        callback,
      },
      sentryLogger: mockLogger,
      env: 'production',
    });
  }
);

tape(
  'handleLog calls sentry for errors c) where `meta` itself is an error-like object in production',
  t => {
    t.plan(3);
    const mockLogger = {
      log: (type, meta) => {
        t.ok(type === 'error', 'logs as an error');
        t.ok(typeof meta === 'object', 'passes `meta` as an object');
        t.deepEqual(
          meta,
          {message, stack: 'this: 123, that: 324'},
          'meta is preserved'
        );
        t.end();
      },
    };

    const message = 'all gone wrong';

    // $FlowFixMe - missing logger methods in mock
    handleLog({
      transformError,
      payload: {
        level: 'error',
        message,
        meta: {message, stack: 'this: 123, that: 324'},
      },
      sentryLogger: mockLogger,
      env: 'production',
    });
  }
);

tape(
  'handleLog calls sentry for errors d) where `meta` itself is a real error in production',
  t => {
    t.plan(4);

    const message = 'all gone wrong';
    const error = new Error(message);

    const mockLogger = {
      log: (type, meta: PayloadMetaType) => {
        t.ok(type === 'error', 'logs as an error');
        t.ok(
          {}.toString.call(meta) === '[object Error]' || meta instanceof Error
        );
        t.deepEqual(meta, error, 'meta is preserved');
        t.ok(meta.message === message, 'message is preserved');
        t.end();
      },
    };

    // $FlowFixMe - missing logger methods in mock
    handleLog({
      payload: {
        level: 'error',
        message,
        meta: error,
      },
      sentryLogger: mockLogger,
      env: 'production',
    });
  }
);

tape(
  'handleLog does not call sentry for errors where `meta` itself is a real error in development',
  t => {
    t.plan(0);

    const message = 'all gone wrong';
    const error = new Error(message);

    const mockLogger = {
      log: (type, meta: PayloadMetaType) => {
        t.fail('should not call sentry logger in development');
      },
    };

    // $FlowFixMe - missing logger methods in mock
    handleLog({
      payload: {
        level: 'error',
        message,
        meta: error,
      },
      sentryLogger: mockLogger,
      env: 'dev',
    });
    t.end();
  }
);

tape('warns if handleLog called with invalid method in production', t => {
  t.plan(2);

  const unsupportedMethodWarning = new RegExp(
    `^(?!.*fields.*).*\\"level\\"\\:\\"warn\\".*\\"msg\\"\\:\\"logger called with unsupported method.*\\".*$`
  ); // based on `utils/format-stdout.js`

  const consoleSpy = spy(console, 'log');
  const message = '123';

  t.doesNotThrow(() =>
    // $FlowFixMe - `meta` property intentionally not passed
    handleLog({
      payload: {
        level: 'haha',
        message,
        nonMeta: {a: {b: {c: 3}}}, // instead of 'meta'
        callback: () => {},
      },
      env: 'production',
      team: 'lol',
    })
  );

  t.ok(
    consoleSpy.calledWithMatch(unsupportedMethodWarning),
    'logs bad method warning'
  );
  consoleSpy.restore();
  t.end();
});
