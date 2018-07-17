import test from 'tape';
// put in fixtures?
import startServer from '../../server';
import prefixUrl from '@uber/bedrock/prefix-url';
import {testRequest as request} from './utils/test-request';
import {env} from 'process';

const app = 'test';

function setUp() {
  const ctx = {
    oldNodeEnv: env.NODE_ENV,
    oldKarlBucketPrefix: env.KARL_BUCKET_PREFIX,
  };

  env.KARL_BUCKET_PREFIX = 'chameleon-ui-dev/tester/v1.0.0';
  return ctx;
}

function tearDown(ctx) {
  env.NODE_ENV = ctx.oldNodeEnv;
  env.KARL_BUCKET_PREFIX = ctx.oldKarlBucketPrefix;
}

/*
 * Sanity check to make sure that your server starts up without issues.
 */
test('application server', t => {
  const ctx = setUp();
  const server = startServer({}, onServer);

  function onServer() {
    t.ok(server, 'should expose server instance');
    t.ok(server.connection, 'should connect');
    server.destroy(() => {
      tearDown(ctx);
      t.end();
    });
  }
});

/*
 * The following test verifies the most basic healthpoint check. You should
 * augment the server to give more useful health check information.
 */
test('Health Endpoint', t => {
  const ctx = setUp();
  const server = startServer({}, onServer);

  function onServer() {
    request(
      server,
      {
        method: 'GET',
        path: prefixUrl('/health'),
      },
      onResponse
    );

    function onResponse(err, res) {
      t.error(err, 'No error making request');
      t.equal(res.statusCode, 200, 'Returns status code 200');
      server.destroy(() => {
        tearDown(ctx);
        t.end();
      });
    }
  }
});

// Ensure single page app renders HTML with state in JSON global
test('SPA Endpoint', t => {
  const ctx = setUp();
  const server = startServer({}, onServer);

  function onServer() {
    request(
      server,
      {
        method: 'GET',
        path: prefixUrl('/'),
      },
      onResponse
    );

    function onResponse(err, res) {
      t.error(err, 'No error making request');
      t.equal(res.statusCode, 302, 'Returns status code 302');
      server.destroy(() => {
        tearDown(ctx);
        t.end();
      });
    }
  }
});
