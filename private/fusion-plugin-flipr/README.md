# @uber/graphene-flipr

## Overview
Flipr client for Graphene

## Installation

```
npm install @uber/graphene-flipr
```

## Usage Example

```js
// src/main.js

import React from 'react';
import FliprPlugin from '@uber/graphene-flipr';
import MyPlugin from './myplugin';

export default () => {
  const app = new App(<Home />);
  const Flipr = app.plugin(FliprPlugin, {
    config: {
      defaultNamespace: 'awesome-frontend'
    }
  });
  app.plugin(MyPlugin, {Flipr});
  
  return app;
}

// myPlugin.js
export default ({Flipr}) => (ctx, next) => {
  if (Flipr.of().get('be.awesome')) {
    // make awesome
  }
  return next();
}
```

## Config

### Config properties from @uber/graphene-flipr
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
`uber/graphene-flipr` has an optional dependency on a Logger [plugin](https://github.com/uber-web/graphene/blob/master/packages/plugin/docs/index.md) which constructs a logger with [Winston](https://github.com/winstonjs/winston#using-logging-levels)-like interface.