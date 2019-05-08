# @uber/fusion-plugin-initial-state-compat

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

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
