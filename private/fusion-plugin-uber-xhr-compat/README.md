# @uber/fusion-plugin-uber-xhr-compat

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

See [`FetchToken`](https://github.com/fusionjs/fusion-tokens#fetchtoken)
