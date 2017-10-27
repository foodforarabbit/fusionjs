import test from 'tape-cup';
import AssetProxyingPlugin from '../../browser.js';

test('Browser Client', t => {
  t.doesNotThrow(
    AssetProxyingPlugin,
    'does not throw when applied with no arguments'
  );
  t.throws(() => AssetProxyingPlugin({}), 'throws when applied with config');
  t.throws(() => AssetProxyingPlugin().of(), 'throws when instantiated');
  t.end();
});
