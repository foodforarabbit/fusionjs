import tape from 'tape-cup';
import Plugin from '../browser';

tape('browser plugin', t => {
  t.ok(Plugin, 'exports plugin');
  t.end();
});
