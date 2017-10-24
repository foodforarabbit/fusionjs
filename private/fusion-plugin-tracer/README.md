# graphene-tracer

tracer client plugin for granphene

## Installation

```
npm install @uber/graphene-tracer
```

## Graphene

## Usage

```js
// ...
import TracerPlugin from  '@uber/graphene-tracer';
import tracerConfig from  'config/tracer';
// ...

const Tracer = app.plugin(TracerPlugin, {
  Logger, // UniversalLogger plugin instance
  config: tracerConfig,
  options: {}   //optional
});

// Access tracer client
Tracer.of().tracer

// Access tracer span
Tracer.of(ctx).span

// Cleanup tracer client
Tracer.destory()
```

## Config

Config should be added to app/src/config/tracer.js to the scaffolded application

```
export default {
    appName: '<if you want to overwrite>',
    mock: false, // enable only for local testing
    ...
}
```

Detailed config options can be found at https://code.uberinternal.com/diffusion/INJAEGERCLIEN/
