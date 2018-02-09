import test from 'tape-cup';
import AssetProxyingPlugin from '../browser.js';

test('Browser Client', t => {
  t.equal(AssetProxyingPlugin, null, 'no browser plugin');
  t.end();
});
