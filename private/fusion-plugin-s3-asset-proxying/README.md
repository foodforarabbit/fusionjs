# @uber/fusion-plugin-s3-asset-proxying

Cli and fusion plugin to upload and proxy assets to/from S3.

---

### Examples

Upload cli:
```
"build-production": "fusion build --production && upload-assets-to-s3"
```

Plugin:
```js
// main.js
import App from 'fusion-core';
import SecretsPlugin from '@uber/fusion-plugin-secrets';
import AssetProxyingPlugin from '@uber/fusion-plugin-s3-asset-proxying';

export default function() {
  // ... Setup fusion app

  const Secrets = app.plugin(SecretsPlugin);
  app.plugin(AssetProxyingPlugin, {Secrets});
  // ... Configuration of other plugins
}
```

---

### API

Upload cli:
* Cli should be used after a Fusion framework production build by calling either `upload-assets-to-s3`, `upload-assets`, or `upload-s3`.

Plugin:
* `config` - S3 configuration can be overridden (`bucket`, `prefix`, `accessKeyId`, and `secretAccessKey`), but should be kept default at Uber to integrate with the standard S3 infrastructure.

---

