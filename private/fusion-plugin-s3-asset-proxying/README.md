# @uber/fusion-plugin-s3-asset-proxying

Cli and fusion plugin to upload and proxy assets to/from S3.

---

### Examples

Upload cli:
```
"build-production": "fusion build --production && upload-assets-to-s3"
```

```js
// main.js
import App from 'fusion-core';
import AssetProxyingPlugin from '@uber/fusion-plugin-s3-asset-proxying';

export default function() {
  // ... Setup fusion app

  app.register(AssetProxyingPlugin);

  // ... Configuration of other plugins
}
```

---

### API

Upload cli:
* Cli should be used after a Fusion framework production build by calling either `upload-assets-to-s3`, `upload-assets`, or `upload-s3`.

---

