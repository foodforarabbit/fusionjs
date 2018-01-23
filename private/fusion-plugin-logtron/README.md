# @uber/fusion-plugin-logtron

## Overview

Logtron plugin for fusion

## Installation

```
npm install @uber/fusion-plugin-logtron
```

## Usage Example

```js
// src/main.js
import {LoggerToken} from 'fusion-tokens';
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';
import M3Plugin, {M3Token} from '@uber/fusion-plugin-m3';
import FusionLogger, {LogtronBackendsToken, LogtronTeamToken} from '@uber/fusion-plugin-logger';

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
