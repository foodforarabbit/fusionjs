# @uber/fusion-plugin-initial-state-compat

Fusion plugin for initial state compatibility with bedrock

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)

---

### Installation

```
yarn add @uber/fusion-plugin-initial-state-compat
```

### Setup

```js
// src/main.js
import {GetInitialStateToken} from 'fusion-plugin-react-redux';
import GetInitialState from '@uber/fusion-plugin-initial-state-compat';

export default () => {
  const app = new App(<Home />);
  if (__NODE__) {
    app.register(GetInitialStateToken, GetInitialState);
  }
};
```
