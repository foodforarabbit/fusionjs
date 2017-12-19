import test from 'tape-cup';
import AuthHeadersPlugin from '../../browser';

test('exported correctly', t => {
  t.ok(AuthHeadersPlugin, 'exported correctly');
  t.end();
});

test('arguments and service not supported on browser', t => {
  t.doesNotThrow(() => AuthHeadersPlugin(), 'should not throw on browser');
  t.throws(
    () => AuthHeadersPlugin({}),
    'should throw on browser with arguments passed'
  );
  t.throws(
    () => AuthHeadersPlugin().of(),
    'should throw if instantiated on browser'
  );
  t.end();
});
