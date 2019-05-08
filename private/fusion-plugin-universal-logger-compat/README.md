# @uber/fusion-plugin-universal-logger-compat

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Universal Logger compatability layer for bedrock 14 to fusion migration.

--- 

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Dependencies](#dependencies)
    * [`LoggerToken`](#loggertoken)

---

### Installation

```
yarn add @uber/fusion-plugin-universal-logger-compat
```

### Usage

```js
import {Logger} from '@uber/fusion-plugin-universal-logger-compat'
Logger.info('hello world');
```

### Setup 

```js
// src/main.js
import {LoggerToken} from 'fusion-tokens';
import UniversalLoggerPlugin from '@uber/fusion-plugin-universal-logger-compat'

export default () => {
  const app = new App(<Home />);
  app.register(LoggerToken, console);
  app.register(UniversalLoggerPlugin);
}
```

### API

#### Dependencies

##### `LoggerToken`

See [`LoggerToken`](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens#loggertoken)
