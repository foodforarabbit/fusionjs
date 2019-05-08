# TChannel plugin for fusion

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Sets up a server-side instance of [Tchannel](https://github.com/uber/tchannel-node) client, which allows you to make requests to Uber services. This plugin is a required dependency of [`@uber/fusion-plugin-atreyu`](/web/api/uber-fusion-plugin-atreyu)

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`TChannel`](#tchannel)
    * [`TChannelToken`](#tchanneltoken)
  * [Dependencies](#dependencies)
    * [`M3Token`](#m3token)
    * [`UniversalEventsToken`](#universaleventstoken)
    * [`LoggerToken`](#loggertoken)
    * [`TChannelClientToken`](#tchannelclienttoken)

---

### Installation

```
npm install @uber/fusion-plugin-tchannel
```

---

### Usage

This plugin primarily exists to decouple Tchannel from Atreyu. It isn't meant to be used directly after it has been registered.

---

### Setup

```js
// main.js
import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events';
import Logger from '@uber/fusion-plugin-logtron';
import M3, {M3Token} from '@uber/fusion-plugin-m3';
import TChannel, {TChannelToken} from '@uber/fusion-plugin-tchannel';
import {LoggerToken} from 'fusion-tokens';

app.register(UniversalEventsToken, UniversalEvents);
app.register(LoggerToken, Logger);
app.register(M3Token, M3);
__NODE__ && app.register(TChannelToken, TChannel);
```

---

### API

#### Registration API

##### `TChannel`

```js
import TChannel from '@uber/fusion-plugin-tchannel';
```

The plugin. Typically, it should be registered to [`TChannelToken`](#tchanneltoken).

##### `TChannelToken`

```js
import {TChannelToken} from '@uber/fusion-plugin-tchannel';
```

Typically, it should be registered with [`TChannel`](#tchannel).

#### Dependencies

##### `M3Token`

```js
import {M3Token} from 'fusion-plugin-m3';
```

The M3 client plugin, which is used to collect statistics. Server-only. Required. See [https://code.uberinternal.com/diffusion/WEFUSHE/](https://code.uberinternal.com/diffusion/WEFUSHE/)

##### `UniversalEventsToken`

```js
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
```

The universal events plugin, which is used as an event bus. Required for `@uber/fusion-plugin-logtron`. See [https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events)

##### `LoggerToken`

```js
import {LoggerToken} from 'fusion-tokens';
```

A logger plugin. Typically, it should be registered with `@uber/fusion-plugin-logtron`.

##### `TChannelClientToken`

```js
import {TChannelClientToken} from 'fusion-plugin-tchannel';
```

Server-only. Optional. Useful for mocking Tchannel in tests. See [https://github.com/uber/tchannel-node](https://github.com/uber/tchannel-node)

###### Types

```js
class TChannelClient {
  listen() {}
  close() {}
}
```
