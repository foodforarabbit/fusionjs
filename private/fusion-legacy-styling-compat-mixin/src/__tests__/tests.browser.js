/* eslint-env browser */

import tape from 'tape-cup';
import styletron from 'styletron-legacy';

import {clientWrapper} from '../client.js';

tape('clientWrapper', async t => {
  document.body.innerHTML = `<script id="_fusion_legacy_styling_hydration_keys_" type="application/json">["foo_key"]</script>`;
  const mockRender = () => {};
  const wrapped = clientWrapper(mockRender);
  t.deepEqual(styletron.getInjectedKeys().length, 0, 'empty keys to start');
  wrapped();
  t.deepEqual(styletron.getInjectedKeys(), ['foo_key'], 'keys hydrated');
  t.end();
});
