# graphene-heatpipe

Heatpipe publisher plugin for Graphene

## Installation

```
npm install @uber/graphene-heatpipe
```

## Usage
```js
// ...
import HeatpipePlugin from  '@uber/graphene-heatpipe';
import heatpipeConfig from  'config/heatpipe';
// ...
const Heatpipe = app.plugin(HeatpipePlugin, {
  M3,
  Logger,
  UniversalEvents,
  heatpipeConfig
});

if (__NODE__) {
// Sync API
Heatpipe.of().publish(
  {topic: 'awesome-topic', version: 1},
  {stringField: 'hello!'},
  (err, res) => {
    if (err) {
      // error handling
    }
  }
);

// Async API
try {
  const asyncRes = await Heatpipe.of().asyncPublish(
    {topic: 'hp-athena-test_topic', version: 1},
    {stringField: 'hello!'}
  );
} catch(err) {
  // error handling
}
```

## Config
// TODO: Finalize the statement below
```
Note: The config should be produced by app/src/config/heatpipe.js which is scaffolded with your application.
```

Please refer to [@uber/node-heatpipe-publisher](https://code.uberinternal.com/diffusion/MENODE/repository/master/)
