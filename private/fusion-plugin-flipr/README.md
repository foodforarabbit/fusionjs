# @uber/fusion-plugin-flipr

## Overview

[Flipr](https://engdocs.uberinternal.com/fliprdocs/index.html) plugin for FusionJS apps

## Installation

```
npm install @uber/fusion-plugin-flipr
```

## Setup

When Flipr client starts, it finds cache files and loads into memory, this process is called [bootstrapping](https://engdocs.uberinternal.com/fliprdocs/head_flipr_clients/cflipr_client-bootstrap.html). The cache files live on production hosts and the easiest way to retrieve them is through [Boxer - the virtual machine toolbox at Uber](https://engdocs.uberinternal.com/boxer/docker.html#setup-flipr).

To simplify the process fetching the caches for local development, this plugin provides a helper script: `update-flipr-bootstrap [your-flipr-namespace]`

You can add this to the `"scripts"` property in `"package.json"` of your Fusion app, such as:

```js
{
  "name": "lovely-frontend",
  "description": "An example application with FusionJS",
  "version": "1.0.0",
  
  ...
  
  "scripts": {
    ...
    "dev-update-flipr": "update-flipr-bootstrap lovely-frontend"
  },
  
  ...
  
}
```


## Usage Example

```js
// src/main.js
import React from 'react';
import FliprPlugin, {
  FliprToken,
  FliprClientToken,
  FliprConfigToken
} from '@uber/fusion-plugin-flipr';
import {LoggerToken} from 'fusion-tokens';

import MyPlugin from './myplugin';

export default () => {
  const app = new App(<Home />);
  // ...
  app.register(FliprToken, FliprPlugin);
  app.register(LoggerToken, /*some logger*/);

  app.plugin(MyPlugin);
  // ...
  return app;
}

// myPlugin.js
import {createPlugin} from 'fusion-core';
import {FliprToken} from '@uber/fusion-plugin-flipr';

export default createPlugin({
  deps: {
    flipr: FliprToken
  },
  middleware: ({flipr}) => (ctx, next) => {
    if (flipr.get('be.awesome')) {
      // make awesome
    }
    return next();
  }
});
```

---
## API

### Dependency registration
```js
import FliprPlugin, {
  FliprToken,
  FliprClientToken,
  FliprConfigToken
} from '@uber/fusion-plugin-flipr';
import {LoggerToken} from 'fusion-tokens';

// ...
app.register(FliprToken, FliprPlugin);
app.register(LoggerToken, Logger); // Required
app.register(FliprClientToken, FliprClient); // Optional
app.register(FliprConfigToken, fliprConfig); // Optional
```

- FliprPlugin - The plugin
- Logger - (Required) - A [type-compliant logger](https://github.com/fusionjs/fusion-tokens/blob/d285746961b490ec3906c34349d261e90affbc6c/src/index.js#L36-L45). We use [Logtron](https://code.uberinternal.com/diffusion/WEFUSTX/) at Uber for most of the occassions.
- FliprClient - (Optional) - The Flipr native client. This is largely for testing with registered mocks. 
- fliprConfig - (Optional) - See the following section.

---

## Config

### Config properties from @uber/fusion-plugin-flipr

- `defaultNamespace`: string

Equivalent to

```js
propertiesNamespaces: [
  'defaultNamespace',
  `defaultNamespace.${__DATA_CENTER__}`,
  `defaultNamespace.${__HOST_NAME__}`,
]
```
- `dataCenter`: string
- `overrides`: object

Properties from this object will finally override the config initializing `@uber/flipr-client`

### Config properties referenced from @uber/flipr-client
See [@uber/flipr-client](https://code.uberinternal.com/diffusion/RTFLIP/repository/master/) for more information on the following config properties

- `propertiesNamespaces`
- `updateInterval`
- `defaultProperties`
- `diskCachePath`

## Logger
`uber/fusion-plugin-flipr` has an optional dependency on a Logger [plugin](https://github.com/uber-web/fusion/blob/master/packages/plugin/docs/index.md) which constructs a logger with [Winston](https://github.com/winstonjs/winston#using-logging-levels)-like interface.
