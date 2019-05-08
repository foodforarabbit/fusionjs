# @uber/fusion-plugin-web-rpc-compat

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Web RPC compatability layer for bedrock 14 to fusion migration.

--- 

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
  * [Dependencies](#dependencies)
    * [`RPCToken`](#rpctoken)

---

### Installation

```
yarn add @uber/fusion-plugin-web-rpc-compat
```

### Setup 

```js
// src/main.js
import {RPCToken} RPCPlugin from '@uber/fusion-plugin-rpc';
import RPCCompat from '@uber/fusion-plugin-web-rpc-compat'

export default () => {
  const app = new App(<Home />);
  app.register(RPCToken, RPCPlugin);
  app.register(RPCCompat);
}
```

### API

#### Dependencies

##### `RPCToken`

See [`RPCToken`](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-rpc#rpctoken)
