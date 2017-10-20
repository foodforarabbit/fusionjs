import test from 'tape-cup';
// import AssetProxyingPlugin from '../../index.js';
import AssetProxyingPlugin from '../../browser.js';

test('Browser Client', t => {
  t.throws(() => AssetProxyingPlugin().of());
  t.end();
});
