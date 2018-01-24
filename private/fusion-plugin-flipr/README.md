# @uber/fusion-plugin-flipr

## Overview

Flipr client for fusion

## Installation

```
npm install @uber/fusion-plugin-flipr
```

## Usage Example

```js
// src/main.js
import React from 'react';
export FliprPlugin, {
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
  app.register(FliprClientToken, /*some flipr client*/);
  app.register(FliprConfigToken, {
    defaultNamespace: 'awesome-frontend'
  });
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
    if (flipr.from().get('be.awesome')) {
      // make awesome
    }
    return next();
  }
});
```

## Config

### Config properties from @uber/fusion-plugin-flipr
+ `defaultNamespace`: string

Equivalent to

```js
propertiesNamespaces: [
  'defaultNamespace',
  `defaultNamespace.${__DATA_CENTER__}`,
  `defaultNamespace.${__HOST_NAME__}`,
]
```
+ `dataCenter`: string
+ `overrides`: object

Properties from this object will finally override the config initializing `@uber/flipr-client`

### Config properties referenced from @uber/flipr-client
See [@uber/flipr-client](https://code.uberinternal.com/diffusion/RTFLIP/repository/master/) for more information on the following config properties

+ `propertiesNamespaces`
+ `updateInterval`
+ `defaultProperties`
+ `diskCachePath`

## Logger
`uber/fusion-plugin-flipr` has an optional dependency on a Logger [plugin](https://github.com/uber-web/fusion/blob/master/packages/plugin/docs/index.md) which constructs a logger with [Winston](https://github.com/winstonjs/winston#using-logging-levels)-like interface.
