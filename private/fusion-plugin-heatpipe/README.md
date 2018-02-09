# @uber/fusion-plugin-heatpipe

Heatpipe publisher plugin for FusionJS apps.

---

### Installation

```sh
yarn add @uber/fusion-plugin-heatpipe
```

---

### Example

```js
// main.js
import HeatpipePlugin, {
  HeatpipeToken,
  HeatpipeConfigToken
} from '@uber/fusion-plugin-heatpipe';
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';

import heatpipeConfig from  'config/heatpipe';

export default () => {
  const app = new App(...);
  // ...
  app.register(HeatpipeToken, HeatpipePlugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.register(HeatpipeConfigToken, heatpipeConfig);  // optional

  if (__NODE__) {
    app.register(
      createPlugin({
        deps: {
          Heatpipe: HeatpipeToken,
        },
        provides({Heatpipe}) {
          // Sync API
          Heatpipe.publish(
            {topic: 'awesome-topic', version: 1},
            {stringField: 'hello!'},
            (err, res) => {
              if (err) {
                // error handling
              }
            }
          );

          // Async API
          Heatpipe.asyncPublish(
            {topic: 'hp-athena-test_topic', version: 1},
            {stringField: 'hello!'}
          )
            .then(res => {
              /* published successfully */
            })
            .catch(err => {
              /* error handling */
            });
        },
      })
    );
  }
  // ...
  return app;
};
```

---

### API

#### Dependency registration

```js
import {LoggerToken} from 'fusion-tokens';
import M3Plugin, {M3Token} from '@uber/fusion-plugin-m3';
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {HeatpipeConfigToken} from '@uber/fusion-plugin-heatpipe';

app.register(LoggerToken, /*some Logger*/);
app.register(M3Token, M3Plugin);
app.register(UniversalEventsToken, UniversalEvents);
app.register(HeatpipeConfigToken, /*some config*/);
```

##### Required dependencies

Name | Type | Description
-|-|-
`LoggerToken` | `Logger` | A [type-compliant logger](https://github.com/fusionjs/fusion-tokens/blob/master/src/index.js#L23-L32). Using [Logtron](https://code.uberinternal.com/diffusion/WEFUSTX/) is recommended for most cases at Uber.
`M3Token` | `M3Plugin` | An M3 plugin for FusionJS.  Using [@uber/fusion-plugin-m3](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-m3) is recommended for most cases at Uber.
`UniversalEventsToken` | `UniversalEvents` | An event emitter plugin to emit stats to, such as the one provided by [`fusion-plugin-universal-events`](https://github.com/fusionjs/fusion-plugin-universal-events).

##### Optional dependencies

Name | Type | Default | Description
-|-|-|-
`HeatpipeConfigToken` | `HeatpipeConfig` | See [defaults](https://code.uberinternal.com/diffusion/WEFUSVQ/browse/master/src/server.js;73111fbe4aa2f4d8b359d983dd1b6759aee39434$27) | Config overrides for [@uber/node-heatpipe-publisher](https://code.uberinternal.com/diffusion/MENODE/repository/master/).

---

### Configuration

Please refer to [@uber/node-heatpipe-publisher](https://code.uberinternal.com/diffusion/MENODE/repository/master/) for configuration setups.
