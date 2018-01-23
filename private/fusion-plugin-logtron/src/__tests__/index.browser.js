import tape from 'tape-cup';
import Plugin from '../browser';

tape('browser plugin interface', t => {
  t.ok(Plugin, 'exports a default plugin');
  t.end();
});
