// @flow
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';
import tape from 'tape-cup';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import Plugin from '../browser';
import {supportedLevels} from '../constants';

tape('test all methods exist for browser', t => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, {});
  app.middleware({logger: LoggerToken}, ({logger}) => {
    supportedLevels.concat(['log']).forEach(fn => {
      // $FlowFixMe - Logtron has methods that the LoggerToken does not.
      t.equal(typeof logger[fn], 'function', `${fn} was set`);
    });
    t.end();
    return (ctx, next) => next();
  });
  getSimulator(app);
});

tape('test info method', t => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, {
    emit: () => {},
  });
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

tape('test info method with message of an error', t => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, {
    emit: (scope, params) => {
      t.equal(typeof params.meta.error, 'object', 'meta is correctly set');
      t.end();
    },
  });
  app.middleware({logger: LoggerToken}, ({logger}) => {
    logger.info(new Error('some error'));
    return (ctx, next) => next();
  });
  getSimulator(app);
});

tape('test info method with meta of an error', t => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, {
    emit: (scope, params) => {
      t.equal(typeof params.meta.error, 'object', 'meta is correctly set');
      t.end();
    },
  });
  app.middleware({logger: LoggerToken}, ({logger}) => {
    logger.info('hello world', new Error('some error'));
    return (ctx, next) => next();
  });
  getSimulator(app);
});
