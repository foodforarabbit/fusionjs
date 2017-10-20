import tape from 'tape-cup';
import plugin from '../../browser';

tape('Rosetta plugin', t => {
  t.equal(typeof plugin, 'function', 'exposes a function as default export');
  t.end();
});
