// @flow
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

test('supports all logger methods in production', () => {
  const emitter = new TestEmitter();

  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe - TestEmitter is only a partial implementation.
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.register(EnvOverrideToken, 'production');
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  expect.assertions(4 * (supportedLevels.length + 1) + 1);
  const message = 'this is a message';
  // $FlowFixMe - Logger has methods that the LoggerToken does not.
  const child = logger.createChild('test-child');

  let formatPattern;

  // Supported level methods
  supportedLevels.forEach(fn => {
    // $FlowFixMe - Logger has methods that the LoggerToken does not.
    expect(typeof logger[fn]).toBe('function');
    expect(typeof child[fn]).toBe('function');
    const consoleSpy = spy(console, 'log');
    expect(
      // $FlowFixMe - Logger has methods that the LoggerToken does not.
      () => logger[fn](message, {a: {b: {c: 3}}}, () => {})
    ).not.toThrow();

    formatPattern = new RegExp(
      `\\"level\\"\\:\\"${fn}\\".*\\"msg\\"\\:\\"${message}\\".*\\"fields\\"\\:`
    ); // based on `utils/format-stdout.js`

    expect(consoleSpy.calledWithMatch(formatPattern)).toBeTruthy();
    consoleSpy.restore();
  });

  // `log` method
  // $FlowFixMe - Logger has methods that the LoggerToken does not.
  expect(typeof logger.log).toBe('function');
  expect(typeof child.log).toBe('function');
  const consoleSpy = spy(console, 'log');
  expect(() =>
    logger.log('info', message, {a: {b: {c: 3}}}, () => {})
  ).not.toThrow();

  formatPattern = new RegExp(
    `\\"level\\"\\:\\"info\\".*\\"msg\\"\\:\\"${message}\\".*\\"fields\\"\\:`
  ); // based on `utils/format-stdout.js`

  expect(consoleSpy.calledWithMatch(formatPattern)).toBeTruthy();
  consoleSpy.restore();

  // unsupported method
  expect(() =>
    // $FlowFixMe - LoggerToken does not support unavaialable method `lol`
    logger.lol(message, {a: {b: {c: 3}}}, () => {})
  ).toThrow();
});

test('supports all logger methods in development', () => {
  const emitter = new TestEmitter();

  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe - TestEmitter is only a partial implementation.
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.register(EnvOverrideToken, 'dev');
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  expect.assertions(2 * (supportedLevels.length + 1));
  const message = 'this is a message';
  const meta = {a: {aa: {aaa: 3}}, b: 5, c: 'hi'};

  let formatPattern;

  // Supported level methods
  supportedLevels.forEach(fn => {
    const consoleSpy = spy(console, 'log');
    expect(
      // $FlowFixMe - Logger has methods that the LoggerToken does not.
      () => logger[fn](message, meta, () => {})
    ).not.toThrow();

    formatPattern = new RegExp(`${fn}\\:?.*${message}.*${prettify(meta)}`); // based on `utils/format-stdout.js`

    expect(consoleSpy.calledWithMatch(formatPattern)).toBeTruthy();
    consoleSpy.restore();
  });

  // `log` method
  const consoleSpy = spy(console, 'log');
  expect(() => logger.log('info', message, meta, () => {})).not.toThrow();

  formatPattern = new RegExp(`info\\:.*${message}.*${prettify(meta)}`); // based on `utils/format-stdout.js`

  expect(consoleSpy.calledWithMatch(formatPattern)).toBeTruthy();
  consoleSpy.restore();
});

test('handleLog recognizes meta objects sent as messages in production', () => {
  const emitter = new TestEmitter();

  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe - TestEmitter is only a partial implementation.
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.register(EnvOverrideToken, 'production');
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  expect.assertions(2 * (supportedLevels.length + 1));
  const message = {a: {b: {c: 3}}};

  let formatPattern;

  // Supported level methods
  supportedLevels.forEach(fn => {
    const consoleSpy = spy(console, 'log');
    expect(
      // $FlowFixMe - Logger has methods that the LoggerToken does not.
      () => logger[fn](message, {a: {b: {c: 3}}}, () => {})
    ).not.toThrow();

    formatPattern = new RegExp(
      `\\"level\\"\\:\\"${fn}\\".*\\"msg\\"\\:\\"\\".*\\"fields\\"\\:${JSON.stringify(
        message
      )}`
    ); // based on `utils/format-stdout.js`

    expect(consoleSpy.calledWithMatch(formatPattern)).toBeTruthy();
    consoleSpy.restore();
  });

  // `log` method
  const consoleSpy = spy(console, 'log');
  expect(
    // $FlowFixMe - message argument intentionally misused.
    () => logger.log('info', message, '', () => {})
  ).not.toThrow();

  formatPattern = new RegExp(
    `\\"level\\"\\:\\"info\\".*\\"msg\\"\\:\\"\\".*\\"fields\\"\\:${JSON.stringify(
      message
    )}`
  ); // based on `utils/format-stdout.js`

  expect(consoleSpy.calledWithMatch(formatPattern)).toBeTruthy();
  consoleSpy.restore();
});

test('logs partial data when level is valid but arguments incomplete in production', done => {
  const emitter = new TestEmitter();

  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe - TestEmitter is only a partial implementation.
  app.register(UniversalEventsToken, emitter);
  app.register(TeamToken, 'team');
  app.register(EnvOverrideToken, 'production');
  app.middleware({logger: LoggerToken}, ({logger}) => {
    expect.assertions(2 * (supportedLevels.length + 1));
    const message = '123';

    let formatPattern;

    // Supported level methods
    supportedLevels.forEach(fn => {
      const consoleSpy = spy(console, 'log');
      expect(
        // $FlowFixMe - Logger has methods that the LoggerToken does not.
        () => logger[fn](message)
      ).not.toThrow();

      formatPattern = new RegExp(
        `^(?!.*fields.*).*\\"level\\"\\:\\"${fn}\\".*\\"msg\\"\\:\\"${message}\\".*$`
      ); // based on `utils/format-stdout.js`

      expect(consoleSpy.calledWithMatch(formatPattern)).toBeTruthy();
      consoleSpy.restore();
    });

    // `log` method
    const consoleSpy = spy(console, 'log');
    expect(() => logger.log('info', message)).not.toThrow();

    formatPattern = new RegExp(
      `^(?!.*fields.*).*\\"level\\"\\:\\"info\\".*\\"msg\\"\\:\\"${message}\\".*$`
    ); // based on `utils/format-stdout.js`

    expect(consoleSpy.calledWithMatch(formatPattern)).toBeTruthy();
    consoleSpy.restore();

    done();
    return (ctx, next) => next();
  });
  getSimulator(app);
});

test('handleLog calls sentry for errors a) where `meta.error` is an error-like object in production', done => {
  expect.assertions(3);
  const mockLogger = {
    log: (type, meta) => {
      expect(type === 'error').toBeTruthy();
      expect(typeof meta === 'object').toBeTruthy();
      expect(meta).toEqual({
        error: {message: 'all gone wrong', stack: 'this: 123, that: 324'},
        message: 'all gone wrong',
        stack: 'this: 123, that: 324',
      });
      done();
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
});

test('handleLog calls sentry for errors b) where `meta.error` is a real error, and passing a callback in production', done => {
  expect.assertions(4);

  const message = 'all gone wrong';
  const error = new Error(message);

  const callback = thisError => {
    expect((thisError = error)).toBeTruthy();
  };

  const mockLogger = {
    log: (type, meta: PayloadMetaType) => {
      expect(type === 'error').toBeTruthy();
      expect(
        {}.toString.call(meta.error) === '[object Error]' ||
          meta.error instanceof Error
      ).toBeTruthy();
      expect(
        'error' in meta && 'stack' in meta && meta.message === message
      ).toBeTruthy();
      done();
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
});

test('handleLog calls sentry for errors c) where `meta` itself is an error-like object in production', done => {
  expect.assertions(3);
  const mockLogger = {
    log: (type, meta) => {
      expect(type === 'error').toBeTruthy();
      expect(typeof meta === 'object').toBeTruthy();
      expect(meta).toEqual({message, stack: 'this: 123, that: 324'});
      done();
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
});

test('handleLog calls sentry for errors d) where `meta` itself is a real error in production', done => {
  expect.assertions(4);

  const message = 'all gone wrong';
  const error = new Error(message);

  const mockLogger = {
    log: (type, meta: PayloadMetaType) => {
      expect(type === 'error').toBeTruthy();
      expect(
        {}.toString.call(meta) === '[object Error]' || meta instanceof Error
      ).toBeTruthy();
      expect(meta).toEqual(error);
      expect(meta.message === message).toBeTruthy();
      done();
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
});

test('handleLog does not call sentry for errors where `meta` itself is a real error in development', done => {
  const message = 'all gone wrong';
  const error = new Error(message);

  const mockLogger = {
    log: (type, meta: PayloadMetaType) => {
      // $FlowFixMe
      done.fail('should not call sentry logger in development');
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
  done();
});

test('warns if handleLog called with invalid method in production', () => {
  expect.assertions(2);

  const unsupportedMethodWarning = new RegExp(
    `^(?!.*fields.*).*\\"level\\"\\:\\"warn\\".*\\"msg\\"\\:\\"logger called with unsupported method.*\\".*$`
  ); // based on `utils/format-stdout.js`

  const consoleSpy = spy(console, 'log');
  const message = '123';

  expect(() =>
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
  ).not.toThrow();

  expect(consoleSpy.calledWithMatch(unsupportedMethodWarning)).toBeTruthy();
  consoleSpy.restore();
});
