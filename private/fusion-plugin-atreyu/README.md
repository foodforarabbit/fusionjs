# Atreyu plugin for Graphene

This is a Graphene plugin for [Atreyu](https://code.uberinternal.com/diffusion/WEATREY/browse/master/#what-is-atreyu)

Atreyu is data querying/aggregation library similar to GraphQL, but designed to be used with Uber's micro-service infrastructure.

### Atreyu setup

Most micro-services at Uber use the [Thrift](https://thrift.apache.org/) protocol.

In order to use Thrift services via Atreyu, you need to install [IDL, Uber's Thrift registry CLI](https://code.uberinternal.com/w/rpc/idl/).

```
# make sure you're using unpm as the NPM registry
npm install --save-dev idl
```

Make sure cerberus is up-to-date. Run `brew update && brew reinstall cerberus`.

### Simple example

To use a service, first fetch its Thrift definition. `idl list` shows the fully qualified names of all available services in the IDL registry. `idl fetch [service-name]` fetches the Thrift definition and saves it in your project folder.

For example, to use [Safari](https://engdocs.uberinternal.com/safari/index.html) (a geographic metadata lookup service), run `idl fetch code.uber.internal/starcraft/safari`

This will create a `idl` folder and save the Thrift definition for the Safari service there.

To communicate with a micro-service via Atreyu, you typically need to define a graph. Here's an example that lists metadata about all countries where Uber operates in:

```
export default {
  countryGraph: {
    all: {
      service: 'safari',
      method: 'Safari::searchCountries',
      args: {
        request: {}
      }
    }
  }
}
```

See the [Safari Thrift declarations](https://engdocs.uberinternal.com/safari/thrift/index.html) for more information on the Safari API.

You also need to make sure Cerberus is running. Run `cerberus -t safari` from your terminal.

```
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
    serviceNames: ["safari"],
  },
  options: {
    statsd: {gauge() {}, increment() {}, timing() {}}
  }
}

// src/atreyu/graphs.js
export default {
  countryGraph: {
    all: {
      service: 'safari',
      method: 'Safari::searchCountries',
      args: {
        request: {}
      }
    }
  }
}

// src/hello-world.js
export default ({Services}) => (ctx, next) => {
  if (__NODE__) {
    if (ctx.path === '/api/countries') {
      const {graphs} = Services.of(ctx).graphs;
      return graphs.countryGraph.resolve().then(countries => {
        ctx.body = countries.all.map(c => c.name); // ["Afghanistan", "Aland Island", "Albania", ...]
      }).then(next);
    }
  }
  return next();
}
```

##### Common Issues

If your call throws the error `Could not stringify body (res2) argument`, it's most likely due to incorrect `args`. For example, `safari` requests need to be wrapped in a `{request: ...}` object.

If your call throws a connection errors, it's likely due to a missing `/ect/uber/hyperbahn/hosts.json` file. Below is a sample of that file:

```
["127.0.0.1:6424", "127.0.0.1:6425", "127.0.0.1:6426"]
```

Another reason could be that cerberus isn't autodetecting a service. To add it manually, run cerberus with the `-t` flag, e.g. `cerberus -t safari`.

To diagnose issues, it's recommended that you use [Yab](https://github.com/yarpc/yab) to check that a request to a service works without Atreyu. Here's an example:

```
yab --peer-list /etc/uber/hyperbahn/hosts.json -t idl/code.uber.internal/starcraft/safari/safari_v2.thrift safari Safari::searchCountries -3 '{"request": {}}'
```

### Request dependencies

Requests in a graph can depend on data from other requests:

```
export default {
  myGraph: {
    user: {
      service: 'populous',
      method: 'UserService::getUser',
      args: {
        userUuid: '{data.uuid}'
      },
    },
    userSignupTerritoryId: {
      service: 'safari',
      method: 'Safari::getTerritoryIDForLegacyTerritoryUUID',
      dependencies: ['user'],
      args: {
        legacyTerritoryUUID: '{user.signupTerritoryUuid}'
      }
    },
  },
};
```

In the example above `{data.uuid}` refers to a parameter passed to a `Atreyu.of(ctx).myGraph.resolve({uuid})` call.

The `{user.signupTerritory}` specifies that the `legacyTerritoryUUID` argument to the `Safari::getTerritoryIDForLegacyTerritoryUUID` comes from the `user` node.

---

### API

#### Plugin registration

```
const Services = app.plugin(Atreyu, {config, options, graphs, requests})
```

- `config: {serviceNames, services}` - an Atreyu config
  - `serviceNames: Array<string>` - Optional. Enables common service that Atreyu configures out of the box. Valid strings: `api`, `populous`, `marge`, `trident`, `safari`, `fraud-actions`, `mephisto`, `octane`
  - `services: Object<serviceName: string, {type, config}>` - Optional. Configure services that are not automatically configured by Atreyu
    - `serviceName: string` - the developer-friendly name of the service
    - `type: string` - typically, should be `tchannel`
    - `config` - service configuration
      - `as: string` - typically, should be `thrift`
      - `with: string`- typically, should be `hyperbahn` or empty string if the service does not use hyperbahn
      - `peers: Array<string>` - `undefined` if using hyperbahn, or an array of IP address + port
      - `thriftSourcePath: string` - Optional. A path for an IDL file, if it cannot be put in the `idl` folder. Prefer putting thrift definition files in the `idl` folder over using this argument.
      - `hostname: string` - Optional. hostname if the service is an HTTP service
      - `protocol: string` - Optional. protocol of an HTTP service. Typically should be `https` or `http`
      - `port: number` - Optional. Port of HTTP service
  - `idlFolderPath` - Optional. The path to the `idl` folder that contains thrift definitions for the project
  - `statsd: {gauge() {}, increment() {}, timing() {}}` - Required. A statsd client instance
  - `hyperbahnClient` - Optional. If you use Toolshed, you cannot create more than one instance of hyperbahn/t-channel. In that case, pass the existing instance to Atreyu via this option.
- `graphs: Object<graphName: string, graph>` - a map of graphs
  - `graphName: string` - a developer-friendly graph name
  - `graph: Object<key: string, node>` - a map of graph nodes
    - `key: string` - A developer-friendly node name
    - `node: {service, method, args}`
- `requests: {service, request}` - a map of requests
  - `service: string` - the developer-friendly name of the service
  - `request: {method: string, url: string, json: boolean}`

#### Instance properties

```
const {graphs, requests} = Services.of(ctx);
```

- `graphs - Object<string, Resolver>`
- `requests - Object<string, Resolver>`

```
type Resolve {
  resolve: (args: Object) => Promise<Object>
}
```

#### Static methods

- `Services.cleanup()` - Disconnects T-channel connections from Atreyu. Call this method at the end of tests to ensure your Node process exits cleanly.
