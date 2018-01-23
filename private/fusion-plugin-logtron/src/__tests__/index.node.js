import tape from 'tape-cup';
import App from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {getSimulator} from 'fusion-test-utils';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import Plugin, {TeamToken} from '../server';

tape('server plugin basic creation', t => {
  const app = new App('el', el => el);
  app.register(LoggerToken, Plugin);
  app.register(M3Token, {});
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
