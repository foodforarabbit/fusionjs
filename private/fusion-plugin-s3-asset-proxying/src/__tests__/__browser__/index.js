import test from 'tape-cup';
// import AssetProxyingPlugin from '../../index.js';
import AssetProxyingPlugin from '../../browser.js';

test('Browser Client', t => {
  t.doesNotThrow(() => AssetProxyingPlugin({Secrets: {}}));
  t.throws(() => AssetProxyingPlugin({config: {}}));
  t.throws(() => AssetProxyingPlugin().of());
  t.end();
});
