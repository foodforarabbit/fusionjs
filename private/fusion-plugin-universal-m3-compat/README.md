# @uber/fusion-plugin-universal-m3-compat

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Universal M3 compatability layer for bedrock 14 to fusion migration.

--- 

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Dependencies](#dependencies)
    * [`M3Token`](#m3token)

---

### Installation

```
yarn add @uber/fusion-plugin-universal-m3-compat
```

### Usage

```js
import {M3} from '@uber/fusion-plugin-universal-m3-compat'
M3.increment('thing');
```

### Setup 

```js
// src/main.js
import {M3Token} from 'fusion-tokens';
import UniversalM3Plugin from '@uber/fusion-plugin-universal-m3-compat'

export default () => {
  const app = new App(<Home />);
  app.register(M3Token, <something>);
  app.register(UniversalM3Plugin);
}
```

### API

#### Dependencies

##### `M3Token`

See [`M3Token`](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-m3)
