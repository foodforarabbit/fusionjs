import test from 'tape-cup';
import TracerPlugin from '../../browser';

test('Browser Tracer Plugin', t => {
  t.throws(() => TracerPlugin(), 'should not work on browser');
  t.end();
});
