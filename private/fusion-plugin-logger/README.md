# @uber/fusion-plugin-logger

Provides a logger that can be connected to standard Uber log consumption services.

A streamlined replacement for `@uber/fusion-plugin-logtron` logs only essential channels:
* Dev: To terminal via `stdout`
* Production: To Kafka via `stdout` and filebeat
* Production: To Healthline via Sentry (will swicth to use `stderr` and filebeat when available)

---

### Installation

```
yarn add @uber/fusion-plugin-logger
```

---

### Usage

In plugin

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

In react component

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
// src/main.js or src/uber/logging.js
import {LoggerToken} from 'fusion-tokens';
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';
import LoggerPlugin, {
  LoggerTeamToken,
  LoggerErrorTrackingToken,
} from '@uber/fusion-plugin-logger';

import sentryConfig from './config/sentry.js';
//..

export default () => {
  const app = new App(<Home />);
  app.register(LoggerToken, LoggerPlugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.register(LoggerTeamToken, 'team-name');
  app.register(LoggerErrorTrackingToken, {sentry: sentryConfig});
  //..
}
```

---

### API

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

#### Registration API

##### `Logger`

```js
import Logger from '@uber/fusion-plugin-logger';
```

The plugin. Should typically be registered to [`LoggerToken`](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens#loggertoken)

##### `LoggerToken`

The token to register the plugin to. See [`LoggerToken`](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens#loggertoken)

#### Dependencies

##### `UniversalEventsToken`

```js
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
```

The universal events plugin, which is used as an event bus. See [https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events)

##### `LoggerTeamToken`

```js
import {LoggerTeamToken} from '@uber/fusion-plugin-logger';
```

The Uber team name. Server-only. Required. Should be a string. Comes pre-configured in the `uber-web` scaffold.

##### `LoggerErrorTrackingToken`

```js
import {LoggerErrorTrackingToken} from '@uber/fusion-plugin-logger';
```

Used this to pass error tracking configuration. For now it requires Sentry config (pending filebeat enhancements)

```js
import sentryConfig from './config/sentry.js';
app.register(LoggerErrorTrackingToken, {sentry: sentryConfig});
```
