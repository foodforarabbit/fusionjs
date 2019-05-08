# @uber/fusion-plugin-tracer

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Enables distributed tracing via [Jaeger](https://github.com/jaegertracing/jaeger). Distributed tracing is useful for monitoring applications with a micro-service oriented backends because it creates visibility of events across services.

This plugin provides a service that exposes the [OpenTracing API](https://github.com/opentracing/opentracing-javascript)

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`Tracer`](#tracer)
    * [`TracerToken`](#tracertoken)
  * [Dependencies](#dependencies)
    * [`InitTracerToken`](#tracertoken)
    * [`TracerConfigToken`](#tracerconfigtoken)
    * [`TracerOptionsToken`](#traceroptionstoken)

---

### Installation

```
npm install @uber/fusion-plugin-tracer
```

---

### Usage

```js
import {createPlugin} from 'fusion-core';

export default createPlugin({
  deps: {Tracer: TracerToken},
  middleware({Tracer}) {
    return (ctx, next) => {
      const {span} = Tracer.from(ctx);
      span.log({event: 'error', message: 'Some error occurred'});
      return next();
    };
  },
});
```

---

### Setup

```js
import {LoggerToken} from 'fusion-tokens';
import Logger from '@uber/fusion-plugin-logtron';
import Tracer, {
  TracerConfigToken,
  TracerOptionsToken,
  TracerToken
} from  '@uber/@uber/fusion-plugin-tracer';

app.register(LoggerToken, Logger);
app.register(TracerToken, Tracer);
app.register(TracerConfigToken, config});
app.register(TracerOptionsToken, options});
```

---

### API

#### Registration API

##### `Tracer`

```js
import Tracer from '@uber/fusion-plugin-tracer';
```

The plugin. Typically, it should be registered to [`TracerToken`](#tracertoken)

##### `TracerToken`

```js
import {TracerToken} from '@uber/fusion-plugin-tracer';
```

Server-only. Typically it should be registered with [`Tracer`](#tracer)

#### Dependencies

##### `InitTracerToken`

```js
import {InitTracerToken} from '@uber/fusion-plugin-tracer';
```

Optional. Server-only. Useful for mocking Tracer in tests. Defaults to `initTracer` from `@uber/jaeger-client-adapter`.

###### Types

```flow
type InitTracer = (config: TracerConfig, options: TracerOptions) => Tracer
```

##### `TracerConfigToken`

```js
import {TracerConfigToken} from '@uber/fusion-plugin-tracer';
```

Optional. Server-only.

###### Types

The `TracerConfigToken` should be a string representing the service name or a configuration object, as described here: [https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L29](https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L29)

##### `TracerOptionsToken`

```js
import {TracerOptionsToken} from '@uber/fusion-plugin-tracer';
```

Optional. Server-only. Detailed config options can be found at [https://code.uberinternal.com/diffusion/INJAEGERCLIEN/](https://code.uberinternal.com/diffusion/INJAEGERCLIEN/)
