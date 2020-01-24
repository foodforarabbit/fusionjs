/* @noflow */
/* eslint-env browser */

import styletron from 'styletron-legacy';

import {clientWrapper} from '../client.js';

test('clientWrapper', async () => {
  document.body.innerHTML = `<script id="_fusion_legacy_styling_hydration_keys_" type="application/json">["foo_key"]</script>`;
  const mockRender = () => {};
  const wrapped = clientWrapper(mockRender);
  expect(styletron.getInjectedKeys().length).toEqual(0);
  wrapped();
  expect(styletron.getInjectedKeys()).toEqual(['foo_key']);
});
