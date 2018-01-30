# @uber/fusion-plugin-logtron-react

## Overview

[Logtron](https://code.uberinternal.com/diffusion/WELOGTK/) plugin for FusionJS apps with React

## Installation

```
npm install @uber/fusion-plugin-logtron-react
```

## Usage Example

```js
// src/main.js
import {LoggerToken} from 'fusion-tokens';
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';
import M3Plugin, {M3Token} from '@uber/fusion-plugin-m3';
import FusionLogger, {LogtronBackendsToken, LogtronTeamToken} from '@uber/fusion-plugin-logtron-react';

export default () => {
  const app = new App(<Home />);
  app.register(LoggerToken, FusionLogger);
  app.register(M3Token, M3Plugin);
  app.register(UniversalEventsToken, UniversalEvents);
  app.register(LogtronTeamToken, 'team-name');
  app.register(LogtronBackendsToken, {
    // backends config
    // see https://github.com/uber/logtron for api documentation on the logger
  });
  app.middleware({logger: LoggerToken}, ({logger}) => {
    // see https://github.com/uber/logtron for api documentation on the logger
    logger.info('hello world');
    return (ctx, next) => {
      return next();
    } 
  });
}
```

#### Higher order component

```js
import React from 'react';
import {withLogger} from 'fusion-plugin-logtron-react';

class LogtronTester extends React.Component {
  render() {
    const {logger} = this.props;
    return (
      <button onClick={e => {
        e.preventDefault();
        logger.info('Button clicked!');
      }}>Click me!</button>
    );
  }
}

export default withLogger(LogtronTester);
```