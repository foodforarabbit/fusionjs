# @uber/fusion-plugin-logtron-react

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Provides a logger that can be connected to standard Uber log consumption services. Wraps over [@uber/logtron](https://code.uberinternal.com/diffusion/WELOGTK/) (which, in turn, is a fork of [https://github.com/uber/logtron](https://github.com/uber/logtron).

In addition, it exposes a React higher order component that lets you consume the logger from React components.

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
  * [`HOC`](#higher-order-component)

### Installation

```
npm install @uber/fusion-plugin-logtron-react
```

---

### Usage

Within React:

```js
import React from 'react';
import {withLogger} from '@uber/fusion-plugin-logtron-react';

class LogtronTester extends React.Component {
  render() {
    const {logger} = this.props;
    return (
      <button
        onClick={e => {
          logger.info('Button clicked!');
        }}
      >
        Click me!
      </button>
    );
  }
}

export default withLogger(LogtronTester);
```

Outside React:

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
    };
  },
});
```

---

### Setup

```js
// src/main.js
import {LoggerToken} from 'fusion-tokens';
import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events';
import M3Plugin, {M3Token} from '@uber/fusion-plugin-m3';
import Logger, {
  LogtronBackendsToken,
  LogtronTeamToken,
} from '@uber/fusion-plugin-logtron-react';

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
};
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
import {LogtronTeamToken} from '@uber/fusion-plugin-logtron-react';
```

The Uber team name. Server-only. Required. Should be a string. Comes pre-configured in the `uber-web` scaffold.

##### `LogtronBackendsToken`

```js
import {LogtronBackendsToken} from '@uber/fusion-plugin-logtron-react';
```

Backends configuration for logtron. Server-only. Optional. See [https://github.com/uber/logtron#optionsbackends](https://github.com/uber/logtron#optionsbackends)

#### Higher order component

```js
import {withLogger} from '@uber/fusion-plugin-logtron-react';
```

A higher order component that exposes `logger` as a React component prop

##### Types

```
const componentWithLogger:Component = withLogger(component:Component);
```

* `component:Component` - a React component that expects `props.logger`
* returns `componentWithLogger:Component` - a component that provides a logger implementation to `props.logger`
