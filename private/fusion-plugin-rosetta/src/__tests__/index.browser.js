import tape from 'tape-cup';
import plugin from '../browser';

tape('Rosetta plugin', async t => {
  t.equal(plugin, null);
  t.end();
});
