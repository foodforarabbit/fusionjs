# @uber/fusion-plugin-flipr

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Enables dynamic configurability via a [Flipr](https://engdocs.uberinternal.com/fliprdocs/index.html) dashboard.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#API)
  * [Registration API](#registration-api)
    * [`Flipr`](#flipr)
    * [`FliprToken`](#fliprtoken)
  * [Dependencies](#dependencies)
    * [`FliprClientToken`](#fliprclienttoken)
    * [`FliprConfigToken`](#fliprconfigtoken)
    * [`LoggerToken`](#loggertoken)
  * [CLI](#cli)

---

### Installation

```sh
yarn add @uber/fusion-plugin-flipr
```

---

### Usage

```js
// myPlugin.js
import {createPlugin} from 'fusion-core';
import {FliprToken} from '@uber/fusion-plugin-flipr';

export default createPlugin({
  deps: {
    flipr: FliprToken,
  },
  middleware: ({flipr}) => (ctx, next) => {
    if (flipr.get('some.configuration')) {
      // do something based on the flipr configuration value
    }
    return next();
  },
});
```

---

### Setup

```js
// src/main.js
import React from 'react';
import FliprPlugin, {
  FliprToken,
  FliprClientToken,
  FliprConfigToken,
} from '@uber/fusion-plugin-flipr';
import {LoggerToken} from 'fusion-tokens';

export default () => {
  const app = new App(<Home />);

  app.register(FliprToken, FliprPlugin);
  app.register(LoggerToken, logger);

  return app;
};
```

In production, Flipr [bootstraps](https://engdocs.uberinternal.com/fliprdocs/head_flipr_clients/cflipr_client-bootstrap.html) by finding cache files and loading their configurations into memory. The cache files live on production hosts and the easiest way to retrieve them is through [Boxer - the virtual machine toolbox at Uber](https://engdocs.uberinternal.com/boxer/docker.html#setup-flipr).

To simplify the process fetching the caches for local development, this package provides a CLI command: `yarn update-flipr-bootstrap [your-flipr-namespace]`

---

### API

#### Registration API

##### `Flipr`

```js
import Flipr from '@uber/fusion-plugin-flipr';
```

The plugin. Typically, it should be registered to [`FliprToken`](#fliprtoken)

##### `FliprToken`

```js
import {FliprToken} from '@uber/fusion-plugin-flipr';
```

Typically, it should be registered with the [`Flipr`](#flipr) plugin.

#### Dependencies

##### `FliprClientToken`

```js
import {FliprClientToken} from '@uber/fusion-plugin-flipr';
```

Server-only. Optional. Useful for mocking the Flipr client in tests

##### `FliprConfigToken`

```js
import {FliprConfigToken} from '@uber/fusion-plugin-flipr';
```

Server-only. Optional. Configuration for the Flipr client.

###### Types

```js
type Options = {
  // Plugin config properties
  defaultNamespace: string,
  dataCenter: string,
  overrides: Object,
  // @uber/flipr-client config properties
  propertiesNamespaces: [string],
  updateInterval: number,
  defaultProperties: Object,
  diskCachePath: string,
};
```

* `defaultNamespace`: string

  Equivalent to

  ```js
  propertiesNamespaces: [
    'defaultNamespace',
    `defaultNamespace.${__DATA_CENTER__}`,
    `defaultNamespace.${__HOST_NAME__}`,
  ];
  ```

* `dataCenter: string` - either `'sjc1'` or `'dca1'`
* `overrides: Object` - Properties from this object will override the config initializing `@uber/flipr-client`
* `propertiesNamespaces: [string]` - the namespaces that your service will fetch from the backend. If you want to be able to fetch configuration specific for datacenters or specific for particular hosts, you should include the second and third lines as well.
* `updateInterval: number` - polling interval in milliseconds. The recommended value is `5000`
* `defaultProperties: Object` - configuration used when the client cannot load configuration from disk and the backend
* `diskCachePath: string` - the location of the best-effort cache. On startup flipr-client will use the cache in this location to bootstrap. It will get updated by the master flipr-client instance upon successful fetch from the backend when the content differs from the last fetch.

See [@uber/flipr-client](https://code.uberinternal.com/diffusion/RTFLIP/repository/master/) for more information on config properties

##### `LoggerToken`

```js
import {LoggerToken} from 'fusion-tokens';
```

#### CLI

To simplify the process fetching flipr cached files for local development, run this command:

```sh
yarn update-flipr-bootstrap [your-flipr-namespace]
```

The command is just a convenience on [the steps described by Boxer](https://engdocs.uberinternal.com/boxer/docker.html#setup-flipr). It only fetches the global namespace, which means Flipr properties rolled out to specific DCs are excluded from the result.

If you need production bootstrap files, it's located `/var/cache/flipr-config/` on production hosts according to [Flipr](https://engdocs.uberinternal.com/fliprdocs/faq.html). You should adhere to security policies when fetching and committing cache files from production hosts.

