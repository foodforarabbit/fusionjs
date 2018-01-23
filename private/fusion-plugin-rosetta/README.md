# @uber/fusion-plugin-rosetta

## Overview
Rosetta plugin for fusion

## Installation

```
npm install @uber/fusion-plugin-rosetta
```

## Usage Example

```js
// src/main.js
import {LoggerToken} from 'fusion-tokens';
import FusionLogger from '@uber/fusion-plugin-logger';
import FusionRosetta, {RosettaConfigToken} from '@uber/fusion-plugin-rosetta';
import {I18nLoaderToken} from '@uber/fusion-plugin-i18n-react';

export default () => {
  const app = new App(<Home />);
  app.register(I18nLoaderToken, FusionRosetta);
  app.register(LoggerToken, FusionLogger);
  app.register(RosettaConfigToken, {
    service: 'service-name', // optional 
    dir: '../translations/', // optional
    cwd: '/some/path', // optional
    reloadInterval: 1000 * 60 * 60 // optional
  })
  app.middleware({rosetta: I18nLoaderToken}, ({rosetta}) => {
    // ...
    // in tests, you need to call cleanup to clear the load interval
    // ...
    rosetta.clearInterval();
    return (ctx, next) => {
      const {locale, translations} = rosetta.from(ctx);
      return next();
    } 
  });
}
```
