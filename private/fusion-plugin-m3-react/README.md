# @uber/fusion-plugin-m3-react

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

An M3 plugin for FusionJS.

M3 is Uber's internal metrics system.  Leverage this plugin to emit metrics to M3 for storage and later querying.  See [M3 documentation](https://engdocs.uberinternal.com/m3_and_umonitor/what_is_m3.html) for more details.

This plugin is primarily a wrapper on top of [web/m3client](https://code.uberinternal.com/diffusion/WEMCLXD/).

---

### Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Higher order component example](#higher-order-component-example)
- [Setup](#setup)
- [API](#api)
  - [Registration API](#registration-api)
    - [`M3`](#m3)
    - [`M3ClientToken`](#m3clienttoken)
- [Dependencies](#dependencies)
    - [`UniversalEventsToken`](#universaleventstoken)
    - [`CommonTagsToken`](#commontagstoken)
  - [Service API](#service-api)

---

### Installation

```sh
yarn add @uber/fusion-plugin-m3-react
```

---

### Usage

#### Higher order component example

Use the higher order component to access the [M3 Service](#service-api) within React components.

```js
import React from 'react';
import {withM3} from 'fusion-plugin-m3-react';

class M3Tester extends React.Component {
  render() {
    const {m3} = this.props;
    return (
      <button onClick={e => {
        e.preventDefault();
        m3.increment('some-button.click')
      }}>Click me!</button>
    );
  }
}

export default withM3(M3Tester);
```

---

### Setup

```js
// src/main.js
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';
import M3Plugin, {M3Token, CommonTagsToken} from 'fusion-plugin-m3-react';

export default () => {
  const app = new App(...);
  // ...
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents); // required
  app.register(CommonTagsToken, {some: 'tags'}); // optional

  app.middleware({m3: M3Token}, ({m3}) => {
    m3.increment('increment-key', {someTag: 'here'});
    m3.timing('timing-key', 300, {someTag: 'here'});
    m3.gauge('gauge-key', 500, {someTag: 'here'});
    // etc
    return (ctx, next) => next();
  });
  // ...
  return app;
};
```

---

### API

#### Registration API

##### `M3`

```js
import M3 fom 'fusion-plugin-m3-react';
```

The M3 plugin. Typically, it should be registered to [`M3ClientToken`](#M3ClientToken). Provides the [M3 service](#service-api)

##### `M3ClientToken`

```js
import M3ClientToken from 'fusion-plugin-m3-react';
```

The canonical token for the M3 plugin. Typically, it should be registered with the [`M3`](#m3) plugin.

### Dependencies

##### `UniversalEventsToken`

Required. See https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events

##### `CommonTagsToken`

```js
import {CommonTagsToken} from 'fusion-plugin-m3-react';
```

Optional.  Common tags that can be provided to the M3 client.

###### Default values

If no common tags are provided, or values are missing for some expected keys, defaults will be supplied.  See [`src/server.js`](https://code.uberinternal.com/diffusion/WEFUSHE/browse/master/src/server.js;223268cf27b346ef192a7c656c5d22dfdac16bf0$19) for more details.

#### Service API

This plugin is a wrapper on top of [web/m3client](https://code.uberinternal.com/diffusion/WEMCLXD/).  As such, this plugin exports a very similar API.

For more details regarding API methods, see [`m3-client/src/client.js`](https://code.uberinternal.com/diffusion/WEMCLXD/browse/master/src/client.js).

```js
M3.scope(tags: Object) => M3Client
```
Provides a new client with additional common tags supplied.

```js
M3.close() => void
```
Writes queued messages and closes the socket.

```js
M3.counter(key: string, value: number, tags?: Object) => void
```
Sets count for provided tags.  A [counter](https://engdocs.uberinternal.com/m3_and_umonitor/intro/metric_types.html#counter) should be a cumulative metric that repesents an ever increasing value (e.g. requests served) during a certain time frame.

```js
M3.increment(key: string, tags?: Object) => void
```
Increments value for provided tags.  Unlike the [`m3-client`](https://code.uberinternal.com/diffusion/WEMCLXD/browse/master/src/client.js) client API, `increment` does not allow for incrementing by values other than 1.

```js
M3.decrement(key: string, tags?: Object) => void
```
Decrements value for provided tags.

```js
M3.timing(key: string, duration: number, tags?: Object) => void
```
Time something, in milliseconds.  A [timer](https://engdocs.uberinternal.com/m3_and_umonitor/intro/metric_types.html#timer) represents a group of measures summarizing the duration of an event.

```js
M3.gauge(key: string, value: number, tags?: Object) => void
```
Take a gauge reading of something.  A [gauge](https://engdocs.uberinternal.com/m3_and_umonitor/intro/metric_types.html#gauge) value represents a single numerical value at the time of reading that can go up or down (e.g. current memory usage).

##### Immediate flush

Each of the measurment functions above also come with an `immediate*` version which will flush the interval immediately.  Aside from the name, the function signatures are the same:

```js
M3.immediateCounter(key: string, value: number, tags?: Object) => void
M3.immediateIncrement(key: string, tags?: Object) => void
M3.immediateDecrement(key: string, tags?: Object) => void
M3.immediateTiming(key: string, value: number, tags?: Object) => void
M3.immediateGauge(key: string, value: number, tags?: Object) => void
```