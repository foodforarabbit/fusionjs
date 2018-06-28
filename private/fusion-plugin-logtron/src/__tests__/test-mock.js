// @flow
import tape from 'tape-cup';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';
import mock from '../mock';

tape('mock with check log values', async t => {
  const message = 'cats are not dogs';
  const meta = {areCatsDogs: false};

  const app = new App('el', el => el);
  app.register(LoggerToken, mock);
  app.middleware({logger: LoggerToken}, ({logger}) => {
    logger.info(message, meta);
    // $FlowFixMe
    t.equal(logger.calls[0][0], 'info');
    // $FlowFixMe
    t.deepLooseEqual(logger.calls[0][1], [message, {areCatsDogs: false}]);
    t.end();
    return (ctx, next) => next();
  });
  getSimulator(app);
});
