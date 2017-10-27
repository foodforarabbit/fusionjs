import tape from 'tape-cup';
import plugin from '../../browser';

tape('Rosetta plugin', t => {
  t.equal(typeof plugin, 'function', 'exposes a function as default export');
  t.throws(() => plugin({}), 'throws if config is passed');
  t.doesNotThrow(plugin, 'does not throw if applied with no config');
  t.throws(() => plugin().of(), 'throws when constructed');
  t.end();
});
