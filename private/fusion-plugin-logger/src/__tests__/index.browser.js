// @flow
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';
import tape from 'tape-cup';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import Plugin from '../browser';
import {supportedLevels} from '../constants';
import TestEmitter from './test-emitter';

const emitter = new TestEmitter();

tape('test all methods exist for browser', t => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, emitter);
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  supportedLevels.concat(['log']).forEach(fn => {
    // $FlowFixMe - Logger has methods that the LoggerToken does not.
    t.equal(typeof logger[fn], 'function', `${fn} was set`);
  });
  t.end();
});

tape('test info method', t => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, emitter);
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  t.equal(typeof logger.info, 'function', 'exposes logger functions');
  t.doesNotThrow(
    () => logger.info('hello world', {some: 'data'}),
    'does not throw when logging'
  );
  t.end();
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
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  logger.info(new Error('some error'));
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
  const sim = getSimulator(app);
  const logger = sim.getService(LoggerToken);
  logger.info('hello world', new Error('some error'));
});
