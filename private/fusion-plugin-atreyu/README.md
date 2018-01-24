# Atreyu plugin for fusion

This is a fusion plugin for [Atreyu](https://code.uberinternal.com/diffusion/WEATREY/browse/master/#what-is-atreyu)

Atreyu is data querying/aggregation library similar to GraphQL, but designed to be used with Uber's micro-service infrastructure.

```js
// src/main.js
import App from '@fusion/react';
import Atreyu, {AtreyuToken, AtreyuConfigToken} from '@uber/fusion-plugin-atreyu';
import {config} from './atreyu/config';

export default () => {
  const app = new App();

  app.register(AtreyuToken, AtreyuPlugin);
  app.register(AtreyuConfigToken, config);

  return app;
}

// src/atreyu/config.js
export default {
  config: {
    serviceNames: ["safari"],
  },
}
```

### API

#### Dependency resolution

```js
import {M3Token} from '@uber/fusion-plugin-m3';
import {LoggerToken} from 'fusion-tokens';
import {TracerToken} from '@uber/fusion-plugin-tracer';
import {GalileoToken} from '@uber/fusion-plugin-galileo';
import {TChannelToken} from '@uber/fusion-plugin-tchannel';
import Atreyu, {AtreyuToken, AtreyuConfigToken, AtreyuOptionsToken} from 'fusion-plugin-atreyu';

app.register(AtreyuToken, Atreyu);
app.register(AtreyuConfigToken, config);
app.register(M3Token, M3);
app.register(LoggerToken, Logger);
app.register(TracerToken, Tracer);
app.register(GalileoToken, Galileo);
app.register(TChannelToken, TChannel);
app.register(AtreyuOptionsToken, options);
```

- `config: {serviceNames, services}` - an Atreyu config (see https://code.uberinternal.com/diffusion/WEATREY/)
- `M3` - m3 plugin
- `Logger` - logger plugin
- `Tracer` - tracer plugin
- `Galileo` - galileo plugin
- `TChannel` - tchannel plugin
- `options: object` - Atreyu options (optional)


#### Atreyu Testing

```js
// src/main.js
import App from '@fusion/react';
import {default as AtreyuPlugin, AtreyuMockPlugin} from '@uber/fusion-plugin-atreyu';
import {config} from './atreyu/config';

export default () => {
  const app = new App();
  // Create  M3, Logger, Tracer, Galileo plugins
  const Atreyu = app.plugin(AtreyuPlugin, {config, M3, Logger, Tracer, Galileo});
  const AtreyuMocker = app.plugin(AtreyuMockPlugin, {Atreyu});

  // TODO: Implement Mocks
  const atreyuMocker = AtreyuMocker.of();
  atreyuMocker.mockHttp();
  atreyuMocker.mockTChannel();

  // This should automatically inject mocks into Atreyu and return responses when http/tchannel matches
}
```

To implement mocks see docs on [atreyu-test](https://code.uberinternal.com/diffusion/WEATREYUTE/) lib readme.
