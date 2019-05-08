# @uber/fusion-plugin-proxy-compat

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Fusion plugin for bedrock proxies

---

### Table of contents

* [Installation](#installation)
* [Setup](#setup)
* [API](#api)
  * [Dependencies](#dependencies)
    * [`ProxyConfigToken`](#proxyconfigtoken)
    * [`LoggerToken`](#loggertoken)
    * [`TracerToken`](#tracertoken)
    * [`GalileoToken`](#galileotoken)

---

### Installation

```
yarn add @uber/fusion-plugin-proxy-compat
```

---

### Setup

```js
// src/main.js
import {SSRDeciderToken} from 'fusion-core';
import ProxyPlugin, {
  ProxyConfigToken,
  ProxySSRDecider,
} from '@uber/fusion-plugin-proxy-compat';

export default () => {
  const app = new App(<Home />);
  if (__NODE__) {
    app.enhance(SSRDeciderToken, ProxySSRDecider);
    app.register(ProxyConfigToken, {
      test: {
        uri: 'http://localhost:1234/',
        routes: [
          {
            route: '/user/*',
            m3Key: 'test-user',
          },
        ],
      },
    });
    app.register(ProxyPlugin);
  }
};
```

---

### API

#### Dependencies

##### `ProxyConfigToken`

```js
import {ProxyConfigToken} from '@uber/fusion-plugin-proxy-compat';
__NODE__ &&
  app.register({
    test: {
      uri: 'http://localhost:1234/',
      headers: {
        'x-test': 'some-value',
      },
      routes: [
        {
          route: '/user/*',
          m3Key: 'test-user',
          headers: {
            'x-route-specific': 'value',
          },
        },
      ],
    },
  });
```

##### `LoggerToken`

See [`LoggerToken`](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens#loggertoken)

##### `TracerToken`

See [`TracerToken`](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-tracer#tracertoken)

##### `GalileoToken`

See [`GalileoToken`](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-galileo#galileotoken)
