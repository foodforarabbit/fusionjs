// @flow
import tape from 'tape-cup';

import plugin from '../browser.js';

tape('Rosetta plugin', async t => {
  t.equal(plugin, null);
  t.end();
});
