import test from 'tape-cup';
import TracerPlugin from '../../browser';

test('Browser Tracer Plugin', t => {
  t.doesNotThrow(() => TracerPlugin(), 'should not throw on browser');
  t.throws(
    () => TracerPlugin({}),
    'should throw on browser with arguments passed'
  );
  t.throws(
    () => TracerPlugin().of(),
    'should throw if instantiated on browser'
  );
  t.end();
});
