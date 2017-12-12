# Atreyu plugin for fusion

This is a fusion plugin for [Atreyu](https://code.uberinternal.com/diffusion/WEATREY/browse/master/#what-is-atreyu)

Atreyu is data querying/aggregation library similar to GraphQL, but designed to be used with Uber's micro-service infrastructure.

```js
// src/main.js
import App from '@fusion/react';
import Atreyu from '@uber/fusion-plugin-atreyu';
import {config} from './atreyu/config';

export default () => {
  const app = new App();
  const Atreyu = app.plugin(AtreyuPlugin, {config, M3, Logger, Tracer, Galileo})
  // atreyu client
  const atreyu = Atreyu.of();
}

// src/atreyu/config.js
export default {
  config: {
    serviceNames: ["safari"],
  },
}
```

#### Plugin registration

```
const Services = app.plugin(Atreyu, {config, M3, Logger, Tracer, Galileo, TChannel})
```

- `config: {serviceNames, services}` - an Atreyu config (see https://code.uberinternal.com/diffusion/WEATREY/)
- `M3` - m3 plugin
- `Logger` - logger plugin
- `Tracer` - tracer plugin
- `Galileo` - galileo plugin
- `TChannel` - tchannel plugin


#### Atreyu Testing

```js
// src/main.js
import App from '@fusion/react';
import {AtreyuMockPlugin} from '@uber/fusion-plugin-atreyu';
import {config} from './atreyu/config';

export default () => {
  const app = new App();
  const AtreyuMocker = app.plugin(AtreyuMockPlugin, {config, M3, Logger, Tracer, Galileo});

  // Pass AtreyuMocker in place of Atreyu plugin
  // app.plugin(RPCPlugin, {Atreyu: AtreyuMocker, ....})

  // TODO: Implement Mocks
  const atreyuMocker = AtreyuMocker.of();
  atreyuMocker.mockHttp();
  atreyuMocker.mockTChannel();
}
```

To implement mocks see docs on [atreyu-test](https://code.uberinternal.com/diffusion/WEATREYUTE/) lib readme.
