# @uber/fusion-plugin-galileo

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Sets up Galileo, a mechanism to authorize RPC services at Uber. It helps enforce [Gold Star](https://engdocs.uberinternal.com/goldstar/index.html) compliance to ensure end-to-end security and privacy of data as it flows throughout the Uber stack.

Galileo is a framework for presenting access controls to Uber applications. Galileo uses Wonka under the hood for personnel and service authentication and most applications and services will interact through Galileo li`aries rather than with Wonka directly. Galileo relies on [Jaeger](http://jaeger.readthedocs.io/en/latest/), Uber’s distributed context propagation system, for passing Wonka claims from service/personnel to service.

Wonka provides secure, authenticated access by extending the trust of uSSH up to the instances of Uber services running on a given host. Wonkamaster is an enrollment service and claims provider for Wonka claims, verifiable assertion of facts such as an identity or group membership. Wonka claims ensure the entities you’re communicating with are who they say they are.

The Galileo plugin comes pre-configured in the `uber-web` scaffold. Do not remove it.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`Galileo`](#galileo-plugin)
    * [`GalileoToken`](#galileotoken)
  * [Dependencies](#dependencies)
    * [`LoggerToken`](#loggertoken)
    * [`M3Token`](#m3token)
    * [`TracerToken`](#tracertoken)
    * [`ConfigToken`](#configtoken)
    * [`ClientToken`](#clienttoken)
  * [Service API](#service-api)
    * [`galileo`](#galileo)
      * [`galileo.AuthenticateOut`](#galileoauthenticateout)
      * [`galileo.AuthenticateIn`](#galileoauthenticatein)

---

### Installation

```
yarn add @uber/fusion-plugin-galileo
```

---

### Usage

Typically, you don't need to directly do anything with this plugin. It's a required dependency of `@uber/fusion-plugin-atreyu`.

### Setup

```js
// main.js
import Galileo, {
  GalileoToken,
  GalileoConfigToken,
} from '@uber/fusion-plugin-galileo';

app.register(GalileoToken, Galileo);
app.register(GalileoConfigToken, {
  // optional galileo config
  // see https://code.uberinternal.com/diffusion/ENGALWP/
});
```

---

### API

#### Registration API

##### `Galileo` plugin

```js
import Galileo from '@uber/fusion-plufin-galileo';
```

The plugin. Typically, it should be registered to [`GalileoToken`](#galileotoken)

##### `GalileoToken`

```js
import {GalileoToken} from '@uber/fusion-plugin-galileo';
```

#### Dependencies

##### `LoggerToken`

```js
import {LoggerToken} from 'fusion-tokens';
```

Required. Server-only. Typically it should be registered with `@uber/fusion-plugin-logtron`.

##### `M3Token`

```js
import {M3Token} from '@uber/fusion-plugin-m3';
```

Required. Server-only. Typically it should be registered with `@uber/fusion-plugin-m3`.

##### `TracerToken`

```js
import {TracerToken} from '@uber/fusion-plugin-tracer';
```

Required. Server-only. Typically it should be registered with `@uber/fusion-plugin-tracer`.

##### `ConfigToken`

```js
import {ConfigToken} from '@uber/fusion-plugin-galileo';
```

Server-only. Optional. Configuration object for Galileo.

###### Default values

```js
{
  enabled: true,
  allowedEntities: ['EVERYONE'],
  enforcePercentage: 0.0,
  wonkamasterUrl: __DEV__ && 'https://wonkabar.uberinternal.com'
}
```

See [engsec/galileo-node](https://code.uberinternal.com/diffusion/ENGALWP/) for more information.

##### `ClientToken`

```js
import {ClientToken} from '@uber/fusion-plugin-galileo';
```

Server-only. Optional. Useful for mocking the Galileo client in tests.

#### Service API

See [https://engdocs.uberinternal.com/goldstar/how_to_items/service_access/galileo_node.html](https://engdocs.uberinternal.com/goldstar/how_to_items/service_access/galileo_node.html) for more information.

##### `galileo`

The service exposes the galileo client in a property called `galileo`:

```js
createPlugin({
  deps: {Galileo: GalileoToken},
  provides({Galileo}) {
    const client = Galileo.galileo;
    // figaro magnifico
  },
});
```

##### `galileo.AuthenticateOut`

Authenticates an outbound request

```js
galileo.AuthenticateOut(
  outboundServiceName,
  serviceType,
  span,
  galileoCallback
);
```

* `outboundServiceName: string` - the name of the service that you want to communicate with
* `serviceType: string` - either `'tchannel'` or `'http'`
* `span` - a Jaeger span from the Tracer plugin.
* `galileoCallback: (err: string, galileoHeaders: Object) => void` - a callback that gets called on completion

##### `galileo.AuthenticateIn`

```js
galileo.AuthenticateIn(options, galileoCallback);
```

* `options: Options` - options object
* `galileoCallback: (err: string, isAuthed: boolean) => void` - a callback that gets called on completion

###### Types

```flow
type Options = {
  span: Span // a Jaeger span,
  allowedEntities: ?[string] // ['someServiceName', 'EVERYONE'],
  callerName: string // headers['rpc-caller'] || headers['x-uber-source']
};
```

* `span: Span` - Span in the request context or trace
* `allowedEntities` - Optional. A list of services or groups you want to whitelist
* `callerName` - the name of the caller that can be extracted from 'rpc-caller' or 'x-uber-source' or any other way.
