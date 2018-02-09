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

#### Instance API

##### `atreyu.createAsyncRequest(requestDefinition): (seed) => Promise<response>`

Returns a promisified version of `atreyu.createRequest`. See https://engdocs.uberinternal.com/atreyu/graphs.html#simple-request

```js
const requestDefinition = {
    service: 'populous',
    method: 'UserService::getUser',
    args: { uuid: '{data.myUUID}' }
}
const userRequest = atreyu.createAsyncRequest(requestDefinition)
const response = await userRequest({myUUID: 'abcd'});
```

##### `atreyu.createAsyncGraph(graphDef): (seed) => Promise<response>`

Returns a promisified version of `atreyu.createGraph`. See https://engdocs.uberinternal.com/atreyu/graphs.html#create-graph

```js
const graphDefinition = {
    user: {
        service: 'populous',
        method: 'UserService::getUser',
        args: {uuid: '{data.myUUID}'}
    },
    invited_by: {
        service: 'populous',
        method: 'UserService::getUser',
        args: {uuid: '{user.inviterUuid}'},
        dependencies: ['user']
    }
}
const userGraph = atreyu.createAsyncGraph(graphDefinition);
const response = await userGraph.resolve({myUUID: 'abcd'});
```

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
