import test from 'tape-cup';
import AuthHeadersPlugin from '../../server';

test('exported correctly', t => {
  t.ok(AuthHeadersPlugin, 'plugin exported correctly');
  t.end();
});

test('missing context', t => {
  const plugin = AuthHeadersPlugin();
  t.throws(
    plugin.of,
    'should throw if context not provided during service construction'
  );
  t.end();
});

test('get authentication param from context', t => {
  const ctx = {
    request: {
      headers: {
        'x-auth-params-uuid': 'some-auth-uuid',
      },
    },
  };

  const service = AuthHeadersPlugin().of(ctx);
  t.equal(
    service.get('uuid'),
    ctx.request.headers['x-auth-params-uuid'],
    'correct value associated with uuid provided by service.'
  );
  t.end();
});

test('get authentication param from override', t => {
  const ctx = {
    request: {
      headers: {
        'x-auth-params-uuid': 'some-auth-uuid',
      },
    },
  };
  const configOverride = {
    uuid: 'some-other-auth-uuid',
  };

  const service = AuthHeadersPlugin(configOverride).of(ctx);
  t.equal(
    service.get('uuid'),
    configOverride.uuid,
    'correct orverride value associated with uuid provided by service'
  );
  t.end();
});

test('missing auth param', t => {
  const service = AuthHeadersPlugin().of({});
  t.throws(() => service.get('uuid'), 'should throw if missing auth key');
  t.end();
});
