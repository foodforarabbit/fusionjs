# @uber/fusion-plugin-s3-asset-proxying

Provides a CLI tool to upload assets to S3 (which is currently required to keep assets from 404ing during deployments on Uber infrastructure). The plugin proxies asset requests to S3.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`AssetProxying`](#assetproxying)
  * [Dependencies](#dependencies)
    * [`S3ConfigToken`](#s3configtoken)
  * [CLI](#cli)

### Installation

```sh
yarn add @uber/fusion-plugin-s3-assset-proxying
```

---

### Usage

Once the plugin is installed, run the CLI command to upload assets to S3. From your terminal:

```sh
upload-assets-to-s3
```

### Setup

The `uber-web` scaffold runs the CLI command on build:

```
"build-production": "fusion build --production && upload-assets-to-s3"
```

The plugin proxies asset requests:

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

#### Registration API

```js
import AssetProxying from '@uber/fusion-plugin-s3-asset-proxying';
```

The plugin. Typically does not require a token.

#### Dependencies

##### `S3ConfigToken`

```js
import {S3ConfigToken} from '@uber/fusion-plugin-s3-asset-proxying';
```

An S3 configuration object.

###### Types

```js
type S3Config = {
  bucket: string,
  prefix: string,
  accessKeyId: string,
  secretAccessKey: string,
};
```

#### CLI

```sh
upload-assets-to-s3
upload-assets
upload-s3
```

Running any of the three aliases from the command line will upload assets to the S3 bucket specified by `S3ConfigToken` or to the default Uber one.