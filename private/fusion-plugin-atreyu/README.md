# Atreyu plugin for fusion

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Provides [Atreyu](https://code.uberinternal.com/diffusion/WEATREY/browse/master/#what-is-atreyu) to a Fusion.js app.

Atreyu is data querying/aggregation library similar to GraphQL, but designed to be used with Uber's micro-service infrastructure.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`Atreyu`](#atreyu)
    * [`AtreyuToken`](#atreyutoken)
  * [Dependencies](#dependencies)
    * [`M3Token`](#m3token)
    * [`UniversalEventsToken`](#universaleventstoken)
    * [`LoggerToken`](#loggertoken)
    * [`TracerToken`](#tracertoken)
    * [`GalileoToken`](#galileotoken)
    * [`TChannelToken`](#tchanneltoken)
    * [`AtreyuConfigToken`](#atreyuconfigtoken)
    * [`AtreyuOptionsToken`](#atreyuoptionstoken)
  * [Service API](#service-api)
    * [`createAsyncRequest`](#createasyncrequest)
    * [`createAsyncGraph`](#createasyncgraph)
  * [`Tracing Request`](#tracing-request)
* [Other examples](#other-examples)
  * [Making a request](#making-a-request)
  * [Defining a graph](#defining-a-graph)
  * [Tracing a rpc request](#tracing-a-rpc-request)
  * [Testing](#testing)

---

### Installation

```sh
yarn add @uber/fusion-plugin-atreyu
```

---

### Usage

Below is a basic example of how you might set up a Fusion plugin that fetches and responds to data at some url.

If you want to have a more useful integration where you are making calls from the client-side and, in turn, making backend service calls using Atreyu in the web server layer, we recommend using [fusion-plugin-rpc-react-redux](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-rpc-redux-react) along with this plugin.

```js
// src/example-plugin.js
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';

export default createPlugin({
  deps: {atreyu: AtreyuToken},
  middleware({atreyu}) {
    const getCountries = atreyu.createAsyncGraph({
      countries: {
        service: 'safari',
        method: 'Safari::searchCountries',
        args: {
          request: {}
        },
      },
    });
    return async (ctx, next) => {
      if (ctx.path === '/countries') {
        const result = await getCountries();
        ctx.response.body = result;
      }
      next();
    }
  },
});
```

---

### Setup

```js
// src/main.js
import App from '@fusion/react';
import Atreyu, {
  AtreyuToken,
  AtreyuConfigToken,
} from '@uber/fusion-plugin-atreyu';
import {config} from './atreyu/config';
import ExamplePlugin from './example-plugin';

export default () => {
  const app = new App();

  app.register(AtreyuToken, AtreyuPlugin);
  app.register(AtreyuConfigToken, config);
  app.register(ExamplePlugin);

  return app;
};
```

You also need to setup the Atreyu config appropriately. See [https://engdocs.uberinternal.com/atreyu/configuration.html](https://engdocs.uberinternal.com/atreyu/configuration.html)

Below is an example configuration to allow requests to be made to the Safari service.

```js
// src/atreyu/config.js
export default {
  config: {
    serviceNames: ['safari'],
  },
};
```

### API

#### Registration API

##### `Atreyu`

```js
import Atreyu from '@uber/fusion-plugin-atreyu';
```

The plugin. Typically, it should be registered to [`AtreyuToken`](#atreyutoken)

##### `AtreyuToken`

```js
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
```

Typically, should be registered with [`Atreyu`](#atreyu)

#### Dependencies

##### `M3Token`

```js
import {M3Token} from 'fusion-plugin-m3';
```

The M3 client plugin, which is used to collect statistics. Server-only. Required. See [https://code.uberinternal.com/diffusion/WEFUSHE/](https://code.uberinternal.com/diffusion/WEFUSHE/)

##### `UniversalEventsToken`

```js
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
```

The universal events plugin, which is used as an event bus. Required for `@uber/fusion-plugin-logtron`. See [https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events)

##### `LoggerToken`

```js
import {LoggerToken} from 'fusion-tokens';
```

A logger plugin. Typically, it should be registered with `@uber/fusion-plugin-logtron`.

##### `TracerToken`

```js
import {TracerToken} from '@uber/fusion-plugin-tracer';
```

The tracer plugin. Required. Server-only.

##### `GalileoToken`

```js
import {GalileoToken} from '@uber/fusion-plugin-galileo';
```

The Galileo plugin. Required. Server-only.

##### `TChannelToken`

```js
app.register(TChannelToken, TChannel);
```

The TChannel plugin. Required. Server-only.

##### `AtreyuConfigToken`

```js
app.register(AtreyuConfigToken, config);
```

Optional. Server-only. See [https://engdocs.uberinternal.com/atreyu/configuration.html](https://engdocs.uberinternal.com/atreyu/configuration.html)

##### `AtreyuOptionsToken`

```js
app.register(AtreyuOptionsToken, options);
```

Optional. Server-only. See [https://engdocs.uberinternal.com/atreyu/configuration.html#other-configs](https://engdocs.uberinternal.com/atreyu/configuration.html#other-configs)

#### Service API

##### `createAsyncRequest`

Returns a promisified version of `atreyu.createRequest`. See [https://engdocs.uberinternal.com/atreyu/graphs.html#simple-request](https://engdocs.uberinternal.com/atreyu/graphs.html#simple-request)

```flow
const request:Function = atreyu.createAsyncRequest(definition: Object);
```

* `definition: Object` - an atreyu request definition. See [https://engdocs.uberinternal.com/atreyu/graphs.html#simple-request](https://engdocs.uberinternal.com/atreyu/graphs.html#simple-request)
* returns `request: (data) => Promise<any>`

##### `createAsyncGraph`

Returns a promisified version of `atreyu.createGraph`. See [https://engdocs.uberinternal.com/atreyu/graphs.html#create-graph](https://engdocs.uberinternal.com/atreyu/graphs.html#create-graph)

```js
const graph: Function = atreyu.createAsyncGraph((definition: Object));
```

* `definition: Object` - an atreyu request definition. See [https://engdocs.uberinternal.com/atreyu/graphs.html#create-graph](https://engdocs.uberinternal.com/atreyu/graphs.html#create-graph)
* returns `request: (data) => Promise<any>`

#### Tracing

Automatically enable end to end tracing by passing in `context` to your rpc calls

```js
// Create async graph
const graph: Function = atreyu.createAsyncGraph((definition: Object));

// Resolve async graph with ctx
graph(data, ctx)
```

---

### Other examples

#### Making a request

```js
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {createPlugin} from 'fusion-core';

export default createPlugin({
  deps: {atreyu: AtreyuToken},
  provides({atreyu}) {
    const requestDefinition = {
      service: 'populous',
      method: 'UserService::getUser',
      args: {uuid: '{data.myUUID}'},
    };
    const getUser = atreyu.createAsyncRequest(requestDefinition);
    return {
      async getUser() {
        return await getUser({myUUID: 'abcd'});
      },
    };
  },
});
```

#### Defining a graph

```js
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {createPlugin} from 'fusion-core';

export default createPlugin({
  deps: {atreyu: AtreyuToken},
  provides({atreyu}) {
    const graphDefinition = {
      user: {
        service: 'populous',
        method: 'UserService::getUser',
        args: {uuid: '{data.myUUID}'},
      },
      invited_by: {
        service: 'populous',
        method: 'UserService::getUser',
        args: {uuid: '{user.inviterUuid}'},
        dependencies: ['user'],
      },
    };
    const getInviter = atreyu.createAsyncGraph(graphDefinition);
    return {
      async getInviter() {
        return await getInviter({myUUID: 'abcd'});
      },
    };
  },
});
```

#### Tracing request

```js
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {createPlugin} from 'fusion-core';

export default createPlugin({
  deps: {atreyu: AtreyuToken},
  middleware({atreyu}) {
    const graphDefinition = {
      user: {
        service: 'populous',
        method: 'UserService::getUser',
        args: {uuid: '{data.id}'},
      }
    };
    const getUserInfo = atreyu.createAsyncGraph(graphDefinition);
    return async (ctx, next) => {
      if (ctx.path === '/userinfo') {
        const {id} = ctx.request.body;
        // Pass in ctx to enable end to end tracing
        const result = await getUserInfo({id}, ctx);
        ctx.response.body = result;
      }
      next();
    }
  },
});
```

#### Testing

You can use the `@uber/atreyu-test` module to help with mocking responses from atreyu. For example:

```js
// src/main.js
import {test, getSimulator} from 'fusion-test-utils';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {AtreyuMocker} from '@uber/atreyu-test';
import loadApp from './main';

test('example atreyu test', t => {
  const app = await loadApp();
  app.enhance(AtreyuToken, (atreyu) => {
    const mocker = new AtreyuMocker(atreyu);
    mocker.mockTChannel(
      'service',
      'method',
      function respond(headers, args, cb) {
        cb(null, {
          ok: true,
          body: {}
        });
      }
    );
    return mocker;
  });
  const sim = getSimulator(app);
  const ctx = await sim.render('/');
  // ... assertions ...
});
```

To implement mocks see docs on [atreyu-test](https://code.uberinternal.com/diffusion/WEATREYUTE/) lib readme.
