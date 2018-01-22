import tape from 'tape-cup';
import plugin from '../browser';

tape('browser plugin re-exports', t => {
  t.equal(typeof plugin, 'function');
  t.end();
});
