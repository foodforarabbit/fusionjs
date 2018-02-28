# @uber/fusion-plugin-heatpipe

Heatpipe publisher plugin for Fusion.js apps.

Heatpipe is Uber's structured data pipeline which formalizes the process for publishing and consuming data and runs on top of the Kafka messaging system.  Thisinvolves naming and defining data schemas as well as associating them with  topics.  For more details, see the [Heatpipe](https://code.uberinternal.com/w/projects/database/heatpipe/) and [Kafka](https://engdocs.uberinternal.com/Kafka-documentation/index.html) documentation.

This plugin is primarily a wrapper on top of [node-heatpipe-publisher](https://code.uberinternal.com/diffusion/MENODE/).

---

### Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Publishing to Heatpipe](#publishing-to-heatpipe)
- [Setup](#setup)
- [API](#api)
  - [Registration API](#registration-api)
    - [`HeatpipePlugin`](#heatpipeplugin)
    - [`HeatpipeToken`](#heatpipetoken)
  - [Dependencies](#dependencies)
    - [`HeatpipeConfigToken`](#heatpipeconfigtoken)
    - [`M3Token`](#m3token)
    - [`LoggerToken`](#loggertoken)
    - [`UniversalEventsToken`](#universaleventstoken)
  - [Service API](#service-api)

---

### Installation

```sh
yarn add @uber/fusion-plugin-heatpipe
```

---

### Usage

#### Publishing to Heatpipe

```js
export default () => {
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
        {stringField: 'hello!'})
        .then(res => {
          /* published successfully */
        })
        .catch(err => {
          /* error handling */
        });
    },
  })
);
```

---

### Setup

```js
// src/main.js
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
  // ...
  return app;
};
```

---

### API

#### Registration API

##### `HeatpipePlugin`

The Heatpipe plugin.  Provides the Heatpipe [service API](#service-api).

##### `HeatpipeToken`

The canonical token for the Heatpipe plugin. Typically, it should be registered with the [Heatpipe](#HeatpipePlugin) plugin.

#### Dependencies

##### `HeatpipeConfigToken`

Optional.  Server only.  Configuration for Heatpipe.  Please refer to [@uber/node-heatpipe-publisher](https://code.uberinternal.com/diffusion/MENODE/repository/master/) for configuration descriptions.

###### Default values

If not all expected key-values are provided, [defaults](https://code.uberinternal.com/diffusion/WEFUSVQ/browse/master/src/server.js$27) will be used for those not supplied.

##### `M3Token`

Server only.  An M3 plugin for FusionJS.  Typically, it is registered with [@uber/fusion-plugin-m3](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-m3)  at Uber.

##### `LoggerToken`

Server only.  A [type-compliant logger](https://github.com/fusionjs/fusion-tokens/blob/master/src/index.js#L23-L32). Typically, it is registered with [Logtron](https://code.uberinternal.com/diffusion/WEFUSTX/) for most cases at Uber.

###### Types

See [fusion-tokens](https://github.com/fusionjs/fusion-tokens#loggertoken).

##### `UniversalEventsToken`

An event emitter plugin which emits the actions.  Typically, it is registered with [`fusion-plugin-universal-events`](https://github.com/fusionjs/fusion-plugin-universal-events).

#### Service API

```js
type TopicInfo = {
  topic: string,
  version: number,
  exact: boolean
}
Heatpipe.asyncPublish(topicInfo: TopicInfo, message: Object) => Promise
```

Server only.  Publishes the message given the topic info and can be awaited.

```js
Heatpipe.publish(topicInfo: TopicInfo, message: Object, cb: Function) => void
```

Publishes the message given the topic info.


```js
Heatpipe.destroy(cb: Function) => void
```

Server only.  Closes the Kafka REST client, if applicable, and calls the callback function.

