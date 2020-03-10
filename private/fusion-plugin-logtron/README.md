# @uber/fusion-plugin-logtron

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Provides a logger that can be connected to standard Uber log consumption services. Wraps over [@uber/logtron](https://code.uberinternal.com/diffusion/WELOGTK/) (which, in turn, is a fork of [https://github.com/uber/logtron](https://github.com/uber/logtron).

If you need to use this plugin from a React component, you should use `useService` from [`fusion-react`](https://github.com/uber/fusionjs/tree/master/fusion-react) in combination with this package.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`Logger`](#logger)
    * [`LoggerToken`](#loggertoken)
  * [Dependencies](#dependencies)
    * [`M3Token`](#m3token)
    * [`UniversalEventsToken`](#universaleventstoken)
    * [`LogtronTeamToken`](#logtronteamtoken)
    * [`LogtronBackendsToken`](#logtronbackendstoken)

### Installation

```
npm install @uber/fusion-plugin-logtron
```

---

### Usage

```js
import createPlugin from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';

export default createPlugin({
  deps: {logger: LoggerToken},
  middleware({logger}) {
    return (ctx, next) => {
      // see https://github.com/uber/logtron for api documentation on the logger
      logger.info('hello world');
      return next();
    }
  }
});
```

---

### Setup

```js
// src/main.js
import {LoggerToken} from 'fusion-tokens';
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';
import M3Plugin, {M3Token} from '@uber/fusion-plugin-m3';
import Logger, {LogtronBackendsToken, LogtronTeamToken} from '@uber/fusion-plugin-logger';

export default () => {
  const app = new App(<Home />);
  app.register(LoggerToken, Logger);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.register(LogtronTeamToken, 'team-name');
  app.register(LogtronBackendsToken, {
    // backends config
    // see https://github.com/uber/logtron for api documentation on the logger
  });
}
```

---

### API

#### Registration API

##### `Logger`

```js
import Logger from '@uber/fusion-plugin-logger';
```

The plugin. Should typically be registered to [`LoggerToken`](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens#loggertoken)

##### `LoggerToken`

The token to register the plugin to. See [`LoggerToken`](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens#loggertoken)

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

The universal events plugin, which is used as an event bus. See [https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events)

##### `LogtronTeamToken`

```js
import {LogtronTeamToken} from '@uber/fusion-plugin-logtron';
```

The Uber team name. Server-only. Required. Should be a string. Comes pre-configured in the `uber-web` scaffold.

##### `LogtronBackendsToken`

```js
import {LogtronBackendsToken} from '@uber/fusion-plugin-logtron';
```

Backends configuration for logtron. Server-only. Optional. See [https://github.com/uber/logtron#optionsbackends](https://github.com/uber/logtron#optionsbackends)

##### `LogtronTransformsToken`

```js
import {LogtronTransformsToken} from '@uber/fusion-plugin-logtron';
```

Array of transform functions. Server-only. Optional. See [https://github.com/uber/logtron#optionstransforms](https://github.com/uber/logtron#optionstransforms)

