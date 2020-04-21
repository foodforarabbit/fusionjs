# @uber/fusion-plugin-logtron

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Provides a logger that can be connected to standard Uber log consumption services (kafka and healthline)

**IMPORTANT changes in V3.x.x:**
* As of v3.x.x the name format for the kafka topic has changed
  * *before 3.x.x*\
`<team>-<appName>` (e.g. "everything-web-restaurant-signup")
  * *3.x.x and after*\
`<appName>` (e.g. "web-restaurant-signup")

* fusion-plugin-logtron-react is now deprecated
  * If you need to use this plugin from a React component, you should use `useService` from [`fusion-react`](https://github.com/uber/fusionjs/tree/master/fusion-react) in combination with this package. See the [example](#in-react-component) below.

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

#### In Fusion middleware

```js
import createPlugin from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';

export default createPlugin({
  deps: {logger: LoggerToken},
  middleware({logger}) {
    return (ctx, next) => {
      // log info
      logger.info('hello world', {some: metadata});
      // this does the same as above statement
      logger.log('info', 'hello world', {some: metadata});
      // log an error with an instance of Error
      logger.error('something broke', anErrorObject);
      // log an error with an error-like object
      logger.error('something broke', {message, stack: '..blah..', });
      // you can also skip the message field
      logger.error(anErrorObject);
      return next();
    }
  }
});
```

#### In React Component

```js
import {LoggerToken} from 'fusion-tokens';
import {useService} from 'fusion-react';

const MyComponent = props => {
  const logger = useService(LoggerToken);
  if (badThings) {
    logger.error(new Error('bad things happened'));
  }
  // ..
}
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

#### Logger API

The following logger levels/methods are supported:
```js
logger.error
logger.warn
logger.info
logger.debug
logger.silly
logger.verbose
logger.trace
logger.access
logger.fatal
```

You can also call also pass any level as the first argument to `logger.log` (see [Usage](#usage) above)
All methods will log to kafka in production. Additionally `error` will log to Healthline.

##### Arguments

Generically all logger.methods (except `log`) accept arguments in the following format:

```js
logger.<method>(message: string, meta?: any, callback?: function)
```

**Additional guidance for `error` method only:** In order to generate well populated Healthline logs, developers are encouraged to supply a `meta` object in one of the following formats.

* An Error object
* An object with Error-like properties
* `{error: <an Error object>}`
* `{error: <an object with Error-like properties>}`

"With Error-like properties" means containing at least `message` and `stack` properties.


Here are some examples of well-formatted `error` calls:

```js
logger.error('oh no!', new Error('oh no!'));
logger.error('oh no!', new Error('oh no!'), aCallbackFunction);
logger.error('oh no!', {message: 'oh no!', stack: aStackString});
logger.error('oh no!', {error: new Error('oh no!'), some: otherData});
logger.error('oh no!', {error: {message: 'oh no!', stack: aStackString});
```

NOTE: For `error` calls, the initial message argument will be ignored be healthline should a `message` property exist in the `meta` argument. For backwards comptability, the `message` argument can also be omitted, providing there is no callback argument:

```js
logger.error(new Error('oh no!'));
```

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
