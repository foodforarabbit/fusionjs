// @flow
import plugin from '../../browser';
import tape from 'tape-cup';

tape('browser plugin throws an error', t => {
  t.throws(plugin, 'throws an error');
  t.end();
});
