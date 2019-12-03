// @flow
import type FusionApp from 'fusion-core';
import AssetProxyingPlugin from '@uber/fusion-plugin-s3-asset-proxying';

export default function initAssets(app: FusionApp) {
  if (__NODE__ && !__DEV__) app.register(AssetProxyingPlugin);
}
