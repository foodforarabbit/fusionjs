# @uber/graphene-s3-asset-proxying

Cli and graphene plugin to upload and proxy assets to/from S3.

---

### Examples

Upload cli:
```
"build-production": "framework build --production && upload-assets-to-s3"
```

Plugin:
```js
// main.js
import App from '@graphene/core';
import AssetProxyingPlugin from 'graphene-s3-asset-proxying';

export default function() {
  // ... Setup graphene app

  // Setup Secrets plugin
  const AssetProxying = app.plugin(AssetProxyingPlugin);

  // Using secrets - only possible on the server
  if (__NODE__) {
    await AssetProxying.of().init();
  }

  // ... Configuration of other plugins
}
```

---

### API

Upload cli:
* Cli should be used after a graphene framework production build by calling either `upload-assets-to-s3`, `upload-assets`, or `upload-s3`.

Plugin:
* `config` - S3 configuration can be overridden (`bucket`, `prefix`, `accessKeyId`, and `secretAccessKey`), but should be kept default at Uber to integrate with the standard S3 infrastructure.

---

