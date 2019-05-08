# @uber/fusion-legacy-styling-compat-mixin

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Legacy styling compatability Fusion App mixin for bedrock 14 to fusion migration.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)

---

### Installation

```
yarn add @uber/fusion-legacy-styling-compat-mixin
```

### Usage

```js
// src/main.js
import App from 'fusion-react';
import {legacyStyling} from '@uber/fusion-legacy-styling-compat-mixin';

const EnhancedApp = legacyStyling(App);

export default () => {
  const app = new EnhancedApp(<Home />);
};
```
