# @uber/fusion-plugin-page-skeleton-compat

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Fusion plugin for rendering a page skeleton compatible with the legacy `@uber/render-page-skeleton` library.

---

### Table of contents

* [Installation](#installation)
* [Setup](#setup)
* [API](#api)
  * [Dependencies](#dependencies)

---

### Installation

```
yarn add @uber/fusion-plugin-page-skeleton-compat
```

### Setup

```js
// src/main.js
import PageSkeletonPlugin from '@uber/fusion-plugin-page-skeleton-compat';
import {RenderToken} from 'fusion-core';

export default () => {
  const app = new App(<Home />);
  if (__NODE__) {
    app.register(RenderToken, PageSkeletonPlugin);
  }
};
```

### API

#### Dependencies
