# @uber/fusion-plugin-rosetta

## Overview

Rosetta is a library to interact with Genghis, a i18n service developed by Uber. The Rosetta plugin is meant to be used as a translation loader for `fusion-plugin-i18n`

## Installation

```
npm install @uber/fusion-plugin-rosetta
```

## Usage Example

```js
// src/main.js
import {LoggerToken} from 'fusion-tokens';
import FusionLogger from '@uber/fusion-plugin-logtron';
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
    reloadInterval: 1000 * 60 * 60, // optional
  });
  app.middleware({rosetta: I18nLoaderToken}, ({rosetta}) => {
    // ...
    // in tests, you need to call cleanup to clear the load interval
    // ...
    rosetta.clearInterval();
    return (ctx, next) => {
      const {locale, translations} = rosetta.from(ctx);
      return next();
    };
  });
};
```

---

### API

```js
import {LoggerToken} from 'fusion-tokens';
import Logger from '@uber/fusion-plugin-logtron';
import Rosetta, {RosettaConfigToken} from '@uber/fusion-plugin-rosetta';
import {I18nLoaderToken} from '@uber/fusion-plugin-i18n-react';

app.register(I18nLoaderToken, Rosetta);
app.register(LoggerToken, Logger);
app.register(RosettaConfigToken, config);
```

| Name               | Type            | Required | Description                                           |
| ------------------ | --------------- | -------- | ----------------------------------------------------- |
| I18nLoaderToken    | `Rosetta`       | yes      | The Rosetta plugin                                    |
| LoggerToken        | `Logger`        | yes      | Typically, it should be `@uber/fusion-plugin-logtron` |
| RosettaConfigToken | `RosettaConfig` | yes      | See [RosettaConfig](#rosettaconfig)                   |

#### RosettaConfig

```js
({service, dir, cwd, reloadInterval});
```

| Name           | Type     | Required | Description                                  |
| -------------- | -------- | -------- | -------------------------------------------- |
| service        | `String` | no       | The name of your project                     |
| dir            | `String` | no       | Looks up translation files in this directory |
| cwd            | `String` | no       | CWD for `dir`                                |
| reloadInterval | `Number` | no       | polling interval in milliseconds             |
