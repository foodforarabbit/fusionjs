# @uber/fusion-plugin-universal-logger-compat

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

See [`LoggerToken`](https://github.com/fusionjs/fusion-tokens#loggertoken)
