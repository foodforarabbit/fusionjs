import tape from 'tape-cup';
import mock from '../mock';

tape('mock with ensure log function is called', async t => {
  let called = false;
  const logFunc = () => {
    called = true;
  };
  const logger = mock({logFunc}).of();
  t.equals(called, false, 'not yet called');
  logger.log();
  t.equals(called, true, 'called');
  t.end();
});

tape('mock with check log values', async t => {
  const level = 'info';
  const message = 'cats are not dogs';
  const meta = {areCatsDogs: false};

  const logFunc = (...args) => {
    t.equals(args[0], level);
    t.equals(args[1], message);
    t.equals(args[2], meta);
  };
  const logger = mock({logFunc}).of();

  logger.log(level, message, meta);
  t.end();
});
