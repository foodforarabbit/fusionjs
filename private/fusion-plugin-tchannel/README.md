# TChannel plugin for fusion

Sets up Tchannel and hyperbahn, which allows you to make requests to Uber services. This plugin is a required dependency for [`@uber/fusion-plugin-atreyu`](/web/api/uber-fusion-plugin-atreyu)

You must have `cerberus` running in order for it to work.

To update cerberus, run:

```sh
brew update && brew reinstall cerberus
```

To start it, make sure you are in the root directory of your project and run:

```sh
cerberus
```

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
    * [`HyperbahnClientToken`](#hyperbahnclienttoken)
    * [`HyperbahnConfigToken`](#hyperbahnconfigtoken)

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

The universal events plugin, which is used as an event bus. Required for `@uber/fusion-plugin-logtron`. See [https://github.com/fusionjs/fusion-plugin-universal-events](https://github.com/fusionjs/fusion-plugin-universal-events)

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

##### `HyperbahnClientToken`

```js
import {HyperbahnClientToken} from 'fusion-plugin-tchannel';
```

Server-only. Optional. Useful for mocking Hyperbahn in tests. See [https://github.com/uber-archive/hyperbahn](https://github.com/uber-archive/hyperbahn)

###### Types

```js
class Hyperbahn {
  destroy() {}
}
```

##### `HyperbahnConfigToken`

Server-only. Optional. Configuration object for Hyperbahn. See [https://github.com/uber-archive/hyperbahn](https://github.com/uber-archive/hyperbahn)
