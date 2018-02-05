# fusion-tracer

A fusion plugin for jaeger tracing

## Installation

```
npm install @uber/@uber/fusion-plugin-tracer
```

## fusion

## Usage

```js
// ...
import {LoggerToken} from 'fusion-tokens';
import TracerPlugin, {
  TracerConfigToken, 
  TracerOptionsToken, 
  TracerToken
} from  '@uber/@uber/fusion-plugin-tracer';

app.register(LoggerToken, /* some logger plugin */);
app.register(TracerToken, TracerPlugin);
app.register(TracerConfigToken, /* tracer config */});
app.register(TracerOptionsToken, /* tracer options */});
app.middleware({Tracer: TracerToken}, ({Tracer}) => {
  // Access tracer client
  Tracer.tracer
  return (ctx, next) => {
    // Access tracer span
    Tracer.from(ctx).span
    return next();
  }
});

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
