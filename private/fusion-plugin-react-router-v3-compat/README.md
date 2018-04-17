# @uber/fusion-plugin-react-router-v3-compat

Fusion.js plugin to provide backward support of react-router v3.x and features of [`fusion-plugin-react-router`](https://github.com/fusionjs/fusion-plugin-react-router).

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)

---

### Installation

```sh
yarn add @uber/fusion-plugin-react-router-v3-compat
```

---

### Usage

```js
// src/shared/components/routes.js
import React from 'react';
import {Route, IndexRoute} from 'fusion-plugin-react-router-v3-compat';
import FourOhFour from './not-found';
import {rpcIds} from '../rpc-constants';
import AppContainer from '../containers/app-container';
import TagsEditorContainer from '../containers/tags-editor-container';
import CounterContainer from '../containers/counter-container';
import ExampleErrorContainer from '../containers/example-error-container';

export default (
  <Route
    path="/"
    component={AppContainer}
    dataDependency={rpcIds.getUser}
    trackingId="home"
  >
    <IndexRoute
      component={TagsEditorContainer}
      dataDependency={rpcIds.getTags}
      trackingId="tags-editor"
    />
    <Route path="counter" component={CounterContainer} trackingId="counter" />
    <Route path="example-error" component={ExampleErrorContainer} trackingId="error" />
    <Route path="*" component={FourOhFour} trackingId="FourOhFour" statusCode={404} />
  </Route>
)
```

---

### Setup

Limit to how React Router v3 is configured, this plugin has to be the FIRST REGISTRATION after the App construction.

```jsx
// src/main.js
import App from 'fusion-react';
import RouterV3Compat from 'fusion-plugin-react-router-v3-compat';
import routes from './shared/components/Routes';

export default function start(App) {
  const app = new App(routes);
  app.register(RouterV3Compat);
  return app;
}
```

---

### API

#### Registration API

##### Plugin

```js
import RouterV3Compat from 'fusion-plugin-react-router';
```

The plugin.


---
