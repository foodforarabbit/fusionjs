# Atreyu plugin for Graphene

This is a Graphene plugin for [Atreyu](https://code.uberinternal.com/diffusion/WEATREY/browse/master/#what-is-atreyu)

### Simple example

```js
// src/main.js
import App from '@graphene/react';
import Atreyu from '@uber/graphene-atreyu';
import {config, options} from './atreyu/config';
import graphs from './atreyu/graphs';
import HelloWorld from './hello-world';

export default () => {
  const app = new App();
  const Services = app.plugin(Atreyu, {config, options, graphs});
  app.plugin(HelloWorld, {Services});
  return app;
}

// src/atreyu/config.js
export default {
  config: {
    serviceNames: ["trident"],
  },
  options: {
    m3: null,
    logger: null,
    galileo: null,
    tracer: null,
    channelsOnInit:true,
  }
}

// src/atreyu/graphs.js
export default {
  trips: {
    service: 'trident',
    method: 'TripService::getTripsForClient',
    args: {
      query: {
        clientUUID: '{data.uuid}',
        returnType: 'TRIP',
      }
    }
  }
}

// src/hello-world.js
export default ({Services}) => (ctx, next) => {
  if (__NODE__) {
    if (ctx.path === '/api/trips') {
      const {graphs} = Services.of(ctx).graphs;
      return graphs.trips.resolve().then(trips => {
        ctx.body = trips;
      }).then(next);
    }
  }
  return next();
}
```

### API

#### Plugin registration

```js
const Services = app.plugin(Atreyu, {config, options, graphs, requests})
```

- `config: Object` - an Atreyu config
- `options: Object`- Atreyu options
- `graphs: Object` - a map of graphs
- `requests: Object` - a map of requests

#### Instance properties

```js
const {graphs, requests} = Services.of(ctx);
```

- `graphs - Object<string, Resolver>`
- `requests - Object<string, Resolver>`

```js
type Resolve {
  resolve: (args: Object) => Promise
}
```

#### Static methods

- `Services.teardown()` - Disconnects the Atreyu client
