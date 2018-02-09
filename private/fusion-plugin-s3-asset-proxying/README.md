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
import AssetProxying from '@uber/fusion-plugin-s3-asset-proxying';

export default function() {
  // ... Setup fusion app

  app.register(AssetProxying);

  // ... Configuration of other plugins
}
```

---

### API

#### Dependency registration

```js
app.register(AssetProxying);
app.register(S3ConfigToken, config);
```

| Name            | Type            | Required | Description                  |
| --------------- | --------------- | -------- | ---------------------------- |
| -               | `AssetProxying` | yes      | The S3 asset proxying plugin |
| `S3ConfigToken` | `S3Config`      | no       | See [S3Config](#s3config)    |

#### S3Config

```js
{
  bucket: String,
  prefix: String,
  accessKeyId: String,
  secretAccessKey: String,
};
```

#### Upload CLI

```sh
upload-assets-to-s3
upload-assets
upload-s3
```

Running any of the three aliases from the command line will upload assets to the S3 bucket specified by `S3ConfigToken` or to the default Uber one.
