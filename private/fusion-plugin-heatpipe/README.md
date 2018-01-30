# fusion-plugin-heatpipe

Heatpipe publisher plugin for FusionJS

## Installation

```
npm install @uber/fusion-plugin-heatpipe
```

## Usage
```js
// main.js
// ...
import HeatpipePlugin, {
  HeatpipeToken,
  HeatpipeConfigToken
} from '@uber/fusion-plugin-heatpipe';
import heatpipeConfig from  'config/heatpipe';

// ...
app.register(HeatpipeToken, HeatpipePlugin);
app.register(HeatpipeConfigToken, heatpipeConfig);  // optional

// User-land
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
```

## API

### Dependency registration

```js
import HeatpipePlugin, {
  HeatpipeToken,
  HeatpipeConfigToken
} from '@uber/fusion-plugin-heatpipe';
import heatpipeConfig from  'config/heatpipe';

app.register(HeatpipeToken, HeatpipePlugin);
app.register(HeatpipeConfigToken, heatpipeConfig);  // optional
```

- `heatpipeConfig`(Optional) - Config overrides for [@uber/node-heatpipe-publisher](https://code.uberinternal.com/diffusion/MENODE/repository/master/). HeatpipePlugin provides a common default if unset. Please refer to [@uber/node-heatpipe-publisher](https://code.uberinternal.com/diffusion/MENODE/repository/master/) for configuration setups.