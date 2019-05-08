# @uber/fusion-plugin-bedrock-compat

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Fusion plugin for bedrock compatability

---

### Table of contents

* [Installation](#installation)
* [Setup](#setup)
* [API](#api)
  * [Dependencies](#dependencies)
    * [`InitializeServerToken`](#initializeservertoken)
    * [`LoggerToken`](#loggertoken)
    * [`M3Token`](#m3token)
    * [`AtreyuToken`](#atreyutoken)
    * [`GalileoToken`](#galileotoken)
    * [`FliprToken`](#fliprtoken)

---

### Installation

```
yarn add @uber/fusion-plugin-bedrock-compat
```

### Setup

```js
// src/main.js
import BedrockCompatPlugin, {
  InitializeServerToken,
} from '@uber/fusion-plugin-bedrock-compat';
import initServer from './server/index.js';

export default () => {
  const app = new App(<Home />);
  if (__NODE__) {
    app.register(InitializeServerToken, initServer);
    app.register(BedrockCompatPlugin);
  }
};
```

### API

#### Dependencies

##### `InitializeServerToken`

Function that takes and returns a bedrock server.

##### `LoggerToken`

See [`LoggerToken`](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens#loggertoken)

##### `M3Token`

See [`M3Token`](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-m3)

##### `AtreyuToken`

See
[`AtreyuToken`](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-atreyu#atreyutoken)

##### `GalileoToken`

See
[`GalileoToken`](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-galileo#galileotoken)

##### `FliprToken`

See
[`FliprToken`](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-flipr#fliprtoken)
