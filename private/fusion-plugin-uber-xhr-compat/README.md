# @uber/fusion-plugin-uber-xhr-compat

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Uber Xhr compatability layer for bedrock 14 to fusion migration.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Dependencies](#dependencies)
    * [`FetchToken`](#fetchtoken)

---

### Installation

```
yarn add @uber/fusion-plugin-uber-xhr-compat
```

### Usage

```js
import {UberXhr} from '@uber/fusion-plugin-uber-xhr-compat';
const xhr = UberXhr();
```

### Setup

```js
// src/main.js
import {FetchToken} from 'fusion-tokens';
import UberXhrPlugin from '@uber/fusion-plugin-uber-xhr-compat';

export default () => {
  const app = new App(<Home />);
  if (__BROWSER__) {
    app.register(FetchToken, window.fetch);
    app.register(UberXhrPlugin);
  }
};
```

### API

#### Dependencies

##### `FetchToken`

See [`FetchToken`](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens#fetchtoken)
