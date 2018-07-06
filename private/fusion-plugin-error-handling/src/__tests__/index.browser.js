// @flow
import tape from 'tape-cup';
import plugin from '../browser';

tape('browser plugin re-exports', t => {
  t.equal(plugin, null);
  t.end();
});
