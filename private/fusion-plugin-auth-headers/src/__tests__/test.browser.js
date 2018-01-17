import test from 'tape-cup';
import AuthHeadersPlugin from '../browser';

test('exported correctly', t => {
  t.ok(AuthHeadersPlugin, 'exported correctly');
  t.equal(typeof AuthHeadersPlugin, 'function');
  t.end();
});

test('arguments and service not supported on browser', t => {
  t.doesNotThrow(() => AuthHeadersPlugin(), 'should not throw on browser');
  t.throws(
    () => AuthHeadersPlugin().from(),
    'should throw if instantiated on browser'
  );
  t.end();
});
