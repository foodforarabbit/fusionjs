// @flow
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';
import mock from '../mock';

test('mock with check log values', async done => {
  const message = 'cats are not dogs';
  const meta = {areCatsDogs: false};

  const app = new App('el', el => el);
  app.register(LoggerToken, mock);
  app.middleware({logger: LoggerToken}, ({logger}) => {
    logger.info(message, meta);
    // $FlowFixMe
    expect(logger.calls[0][0]).toBe('info');
    // $FlowFixMe
    expect(logger.calls[0][1]).toStrictEqual([message, {areCatsDogs: false}]);
    done();
    return (ctx, next) => next();
  });
  getSimulator(app);
});
