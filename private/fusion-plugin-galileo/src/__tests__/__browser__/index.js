import test from 'tape-cup';
import GalileoPlugin from '../../browser';

test('Browser Galileo Plugin', t => {
  t.doesNotThrow(() => GalileoPlugin(), 'should not throw in browser');
  t.throws(() => GalileoPlugin({}), 'should throw if passed config in browser');
  t.throws(
    () => GalileoPlugin().of(),
    'should throw if constructed in browser'
  );
  t.end();
});
