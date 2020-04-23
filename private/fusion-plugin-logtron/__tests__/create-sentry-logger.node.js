// @flow
/* eslint-env node */
import createSentryLogger from '../src/utils/create-sentry-logger';

test('missing env logs to standard DSN', async () => {
  expect.assertions(1);
  const logger = createSentryLogger({
    id: 'http://uber:uber@localhost:16921/hahaha',
  });
  expect(getDSN(logger)).toBe('http://uber:uber@localhost:16921/hahaha');
});

test('production env logs to standard DSN', async () => {
  expect.assertions(1);
  const logger = createSentryLogger(
    {id: 'http://uber:uber@localhost:16921/hahaha'},
    'production'
  );
  expect(getDSN(logger)).toBe('http://uber:uber@localhost:16921/hahaha');
});

test('staging env logs to standard DSN + `-staging`', async () => {
  expect.assertions(1);
  const logger = createSentryLogger(
    {id: 'http://uber:uber@localhost:16921/hahaha'},
    'staging'
  );
  expect(getDSN(logger)).toBe(
    'http://uber:uber@localhost:16921/hahaha-staging'
  );
});

function getDSN(logger) {
  //$FlowFixMe
  return logger._readableState.pipes.transport.ravenClient.raw_dsn;
}
