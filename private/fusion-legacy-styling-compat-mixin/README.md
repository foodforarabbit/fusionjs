# @uber/fusion-legacy-styling-compat-mixin

Legacy styling compatability mixin for bedrock 14 to fusion migration.

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
