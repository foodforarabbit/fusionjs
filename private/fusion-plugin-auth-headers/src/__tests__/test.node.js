import test from 'tape-cup';
import AuthHeadersPlugin from '../server';

const memoizedMock = {
  has: () => false,
  set: () => null,
};
const noContext = {
  memoized: memoizedMock,
};

test('plugin - exported correctly', t => {
  t.ok(AuthHeadersPlugin, 'plugin exported correctly');
  t.equal(typeof AuthHeadersPlugin, 'function');
  t.end();
});

test('service - missing auth param', t => {
  const service = AuthHeadersPlugin({}).from(noContext);
  t.throws(() => service.get('uuid'), 'should throw if missing auth key');
  t.end();
});

test('service - get authentication param from context', t => {
  const ctx = {
    request: {
      headers: {
        'x-auth-params-uuid': 'some-auth-uuid',
      },
    },
    memoized: memoizedMock,
  };

  const service = AuthHeadersPlugin({}).from(ctx);
  t.equal(
    service.get('uuid'),
    ctx.request.headers['x-auth-params-uuid'],
    'correct value associated with uuid provided by service.'
  );
  t.end();
});

test('service - get authentication param from override', t => {
  const ctx = {
    request: {
      headers: {
        'x-auth-params-uuid': 'some-auth-uuid',
      },
    },
    memoized: memoizedMock,
  };
  const uuidOverride = 'some-other-auth-uuid';

  const service = AuthHeadersPlugin({
    uuid: uuidOverride,
  }).from(ctx);

  if (__DEV__) {
    /* Check development environment */
    t.equal(
      service.get('uuid'),
      uuidOverride,
      'correctly applies override value associated with uuid provided by service'
    );
  } else {
    /* Check production environment */
    t.equal(
      service.get('uuid'),
      ctx.request.headers['x-auth-params-uuid'],
      'correctly ignores override value associated with uuid provided by service (in production)'
    );
  }
  t.end();
});
