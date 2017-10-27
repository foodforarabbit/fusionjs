import tape from 'tape-cup';
import Plugin from '../../browser';

tape('browser plugin', t => {
  t.doesNotThrow(Plugin, 'does not throw when applying plugin');
  t.throws(
    () => Plugin({}),
    'throws if options are passed to the atreyu plugin'
  );
  t.throws(() => Plugin().of(), 'throws when constructed in the browser');
  t.end();
});
