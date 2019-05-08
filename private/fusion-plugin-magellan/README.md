# Fusion plugin for magellan/jarvis 

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Provides integration with magellan and jarvis into fusion apps.

---

### Table of contents

* [Installation](#installation)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`MagellanPlugin`](#magellanplugin)
  * [Dependencies](#dependencies)
    * [`MagellanUriToken`](#magellanuritoken)
    * [`JarvisUriToken`](#jarvisuritoken)

---

### Installation

```sh
yarn add @uber/fusion-plugin-magellan
```

---

### Setup

```js
// src/main.js
import App from '@fusion/react';
import MagellanPlugin from '@uber/fusion-plugin-magellan';

export default () => {
  const app = new App();
  if (__NODE__) {
    app.register(MagellanPlugin);
  }
  return app;
};
```

### API

#### Registration API

##### `MagellanPlugin`

```js
import MagellanPlugin from '@uber/fusion-plugin-magellan';
```

The plugin. Registerd in `__NODE__` only, and generally not registered on any token.

#### Dependencies

##### `MagellanUriToken`

```js
import {MagellanUriToken} from '@uber/fusion-plugin-magellan';
```

Optional - URI config for magellan service.

##### `JarvisUriToken`

```js
import {JarvisUriToken} from '@uber/fusion-plugin-magellan';
```

Optional - URI config for jarvis service.
