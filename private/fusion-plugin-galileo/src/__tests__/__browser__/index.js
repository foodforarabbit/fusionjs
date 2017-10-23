import test from 'tape-cup';
import GalileoPlugin from '../../browser';

test('Browser Galileo Plugin', t => {
  t.throws(() => GalileoPlugin(), 'should not work on browser');
  t.end();
});
