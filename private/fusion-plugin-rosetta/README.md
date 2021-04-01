# @uber/fusion-plugin-rosetta

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Rosetta is a library to interact with [Genghis](https://code.uberinternal.com/w/projects/communicating_with_riders_drivers_and_the_general_public/genghis_-_old/), a i18n service developed by Uber.  The Rosetta plugin is meant to be used as a translation loader for [`fusion-plugin-i18n`](https://github.com/fusionjs/fusion-plugin-i18n-react).

V1 to V2 Migration Guide: [Link](http://t.uber.com/node-rosetta-guide)

---

### Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [As a loader for `fusion-plugin-i18n`](#as-a-loader-for-fusion-plugin-i18n)
- [Setup](#setup)
- [API](#api)
  - [Registration API](#registration-api)
    - [`Rosetta`](#rosetta)
    - [`I18nLoaderToken`](#i18nloadertoken)
  - [Dependencies](#dependencies)
    - [`LoggerToken`](#loggertoken)
    - [`RosettaConfigToken`](#rosettaconfigtoken)
      - [Types](#types)
      - [Default values](#default-values)
  - [Service API](#service-api)
- [Other examples](#other-examples)
  - [Advanced setup](#advanced-setup)
- [Integration in app](#integration-in-app)
- [Local Development](#local-development)
- [For Your Test](#for-your-test)

---

### Installation

```
npm install @uber/fusion-plugin-rosetta
```

---

### Usage

#### As a loader for `fusion-plugin-i18n`

Using Rosetta as a loader for `fusion-plugin-i18n` is as simple as registering the plugin to the [`i18nLoaderToken`](https://github.com/fusionjs/fusion-plugin-i18n/blob/master/src/index.js#L18).

```js
// src/main.js
import FusionRosetta from '@uber/fusion-plugin-rosetta';
import {I18nLoaderToken} from '@uber/fusion-plugin-i18n-react';

export default () => {
  ...
  app.register(I18nLoaderToken, FusionRosetta);
  ...
}
```

This ensures that the translations provided by `fusion-plugin-i18n` are powered by Genghis.  See `fusion-plugin-i18n`'s [dependencies documentation](https://github.com/fusionjs/fusion-plugin-i18n#dependencies) for more details.

For additional performance enhancements, we have created optional tokens to significantly speed up translation key processing on the server.  This will be most noticable for services that subscribe to a larger number of keys.

```js
// src/main.js
import I18n, {
  I18nTranslateFnsToken,
} from 'fusion-plugin-i18n-react';


import FusionRosetta, {
  GetTranslationsToken,
  getTranslationsV2,
  translateKeyV2,
  translateKeysV2,
} from '@uber/fusion-plugin-rosetta';

export default () => {
  ...
  if (__NODE__) {
    app.register(I18nTranslateFnsToken, {
      translateKeys: translateKeysV2,
      translateKey: translateKeyV2,
    });
    app.register(GetTranslationsToken, getTranslationsV2);
  }
  ...
}
```

---

### Setup

```js
// src/main.js
import {LoggerToken} from 'fusion-tokens';
import FusionLogger from '@uber/fusion-plugin-logtron';
import FusionRosetta, {RosettaConfigToken} from '@uber/fusion-plugin-rosetta';
import {I18nLoaderToken} from '@uber/fusion-plugin-i18n-react';

export default () => {
  const app = new App(<div />);

  app.register(I18nLoaderToken, FusionRosetta);
  app.register(LoggerToken, FusionLogger);
  app.register(RosettaConfigToken, {
    service: 'service-name', // optional
    dir: '../translations/', // optional
    cwd: '/some/path', // optional
    reloadInterval: 1000 * 60 * 60, // optional
  });
};
```

---

### API

#### Registration API

##### `Rosetta`

```js
import Rosetta from 'fusion-plugin-rosetta';
```

The Rosetta plugin. Typically, it should be registered to the [`I18nLoaderToken`](#i18nLoaderToken).  Provides the [Rosetta service](#service-api).

##### `I18nLoaderToken`

```js
import {I18nLoaderToken} from 'fusion-plugin-i18n';
```

See the `fusion-plugin-i18n` [documentation](https://github.com/fusionjs/fusion-plugin-i18n#i18nloadertoken) for more details.

#### Dependencies

##### `LoggerToken`

```js
import {LoggerToken} from 'fusion-tokens';
```

See `fusion-token`'s [LoggerToken](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens#loggertoken) documentation for more details.

It is strongly recommended that [`@uber/fusion-plugin-logtron`](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-logtron) is used.

##### `RosettaConfigToken`

```js
import Rosetta, {RosettaConfigToken} from '@uber/fusion-plugin-rosetta';
```

Sets the configuration for Rosetta which is passed to the Genghis client.  Optional.  Server only.

###### Types

```js
type RosettaConfig = {
  service: string,
  dir: string,
  cwd: string,
  reloadInterval: number
}
```

* `service: string` - the name of your project
* `dir: string` - looks up translation files in this directory
* `cwd: string` - CWD for `dir`
* `reloadInterval: number` - polling interval, in milliseconds

###### Default values

If no configuration is provided, only the `service` will have a default value.  In the event that `process.env.SVC_ID` is set, that will be used.  Otherwise, `'dev-service'` is used.

##### `LocaleNegotiationToken`

```js
import Rosetta, {LocaleNegotiationToken} from '@uber/fusion-plugin-rosetta';
```

Implements a custom strategy for determining the client's locale. Optional. Server only.

###### Types

```js
type LocaleNegotiationStrategy = (ctx: Context, supportedLocales: Locales) => Locale
```

The locale negotiation strategy takes a fusion Context and a [Locales](http://t.uber.com/new-locales-npm) object representing the supported locales.
It returns a [Locale](http://t.uber.com/new-locale-npm) object representing the chosen locale.

###### Default values

If no locale negotiation strategy is provided, the application will determine the
client's locale based on the [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) HTTP header.

#### Service API

```js
type RosettaLoader = {
  from: (ctx: Context) => {locale: string, translations: Object},
};
```

* `loader.from: (ctx) => ({locale, translations})` -
  * `ctx: FusionContext` - Required. A [FusionJS context](https://github.com/fusionjs/fusionjs/tree/master/fusion-core#context) object.
  * `locale: Locale` - A [Locale](https://www.npmjs.com/package/locale)
  * `translations: Object` - A object that maps translation keys to translated values for the given locale

---

### Other examples

#### Advanced setup

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

### Integration in app

- If you do not have any customization, you can directly use it when upgrading `@uber/fusion-plugin-rosetta` to latest.
- In DEV, you should have translations folder (default: './translations' or customized as below) ready, the plugin will use translations JSON data as default when dev env. If you want to use prod snapshot in your local, see the 'Local Development' section below.
- If you want to setup the load interval, or disable update, you can set them up in your config.
- If you find your service id is missing in dev, please check your packjson file: "dev": "SVC_ID='your_service' fusion-dev-cli fusion dev", or you can add the service in config as well.

```
src/config/rosetta.js

export default {
  reloadInterval: 1000 * 60 * 60, // set reloadinterval for every 1hr
  disableUpdate: false,
};


main.js

import Rosetta, {RosettaConfigToken} from '@uber/fusion-plugin-rosetta';
import rosettaConfig from './config/rosetta.js';


if (__NODE__) {
  // node specific plugins
  ...
  app.register(RosettaConfigToken, rosettaConfig);
}
```

### Local Development
- Right now in dev env, node-rosetta will use local json file as default (default location: ./translations, but you can config it as fixturesDir). You can put the test json files in this folder.

```
src/config/rosetta.js

export default {
    fixturesDir: './translations', // providing fixtureDir will for dev only
};


// Create new folder and json files:
src/fixtures/zh-CN.json

{
  "test.interval": "9小时"
}


// node-rosetta will use the translations in the json files.
```


- If you want to use prod translations, you should set `useSnapshot=true` in the config and the client will load translations from terrablob (If in local, please add terrablob-gateway http service in your cerberus, e.g., run cerberus -s terrablob-gateway).

```
src/config/rosetta.js

export default {
    useSnapshot: true,
};
```

### For Your Test
- For your server side test, we also provide the mock for test use (avoid to trigger the real download).

```

In your test file
// xx.node.js
import {I18nLoaderToken} from 'fusion-plugin-i18n-react';
import {mock} from '@uber/fusion-plugin-rosetta';

//add this line to your test
app.register(I18nLoaderToken, mock);


Or in your test helper (recommended)
/test-utils/test-app.js
import {I18nLoaderToken} from 'fusion-plugin-i18n-react';
import {mock} from '@uber/fusion-plugin-rosetta';

if (__NODE__) {
  app.register(I18nLoaderToken, mock);
}
```
