# @uber/fusion-plugin-heatpipe

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Heatpipe publisher plugin for Fusion.js apps.

Heatpipe is Uber's structured data pipeline which formalizes the process for publishing and consuming data and runs on top of the Kafka messaging system. This involves naming and defining data schemas as well as associating them with  topics. For more details, see the [Heatpipe](https://code.uberinternal.com/w/projects/database/heatpipe/) and [Kafka](https://engdocs.uberinternal.com/Kafka-documentation/index.html) documentation.

This plugin is primarily a wrapper on top of [web-heatpipe](https://code.uberinternal.com/diffusion/WEWEBGU/).

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
      // Async API
      Heatpipe.asyncPublish(
        {topic: 'hp-example-trips-viewer-fusion-test', version: 2},
        {name: 'bruce', age: 42, details: { favoriteColor: 'black', favoriteMovie: 'batman'}}
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
```

---

### Setup

```js
// src/main.js
import HeatpipePlugin, {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';

export default () => {
  const app = new App(...);
  // ...
  app.register(HeatpipeToken, HeatpipePlugin);
  app.register(UniversalEventsToken, UniversalEvents);
  // ...
  return app;
};
```

---

### API

#### Registration API

##### `HeatpipePlugin`

The Heatpipe plugin. Provides the Heatpipe [service API](#service-api).

##### `HeatpipeToken`

The canonical token for the Heatpipe plugin. Typically, it should be registered with the [Heatpipe](#HeatpipePlugin) plugin.

#### Dependencies

##### `LoggerToken`

Server only. A [type-compliant logger](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens/blob/master/src/index.js#L23-L32). Typically, it is registered with [Logtron](https://code.uberinternal.com/diffusion/WEFUSTX/) for most cases at Uber.

###### Types

See [fusion-tokens](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens#loggertoken).

##### `UniversalEventsToken`

An event emitter plugin which emits the actions. Typically, it is registered with [`fusion-plugin-universal-events`](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events).

#### Service API

```js
type TopicInfo = {
  topic: string,
  version: number
}
Heatpipe.asyncPublish(topicInfo: TopicInfo, message: Object) => Promise<void>
```

Server only. Publishes the message given the topic info and can be awaited. Publish errors can be handled by using `.catch(err => /* handle error */)`.

