/* eslint-env browser */
import tape from 'tape-cup';
import FliprPlugin from '../../client';

tape('FliprPlugin', t => {
  t.doesNotThrow(() => FliprPlugin(), /browser/g, 'No-op on browser');
  t.end();
});
