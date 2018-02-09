import tape from 'tape-cup';
import Plugin from '../browser';

tape('browser plugin', t => {
  t.equals(Plugin, null, 'no plugin in browser');
  t.end();
});
