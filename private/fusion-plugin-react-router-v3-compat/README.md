# @uber/fusion-plugin-react-router-v3-compat

Fusion.js plugin to provide backward support of react-router v3.x. Read the section ["Limitations"](#limitations) to learn more.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Limitations](#limitations)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
* [Credits](#credits)

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
import {RouteV3, IndexRouteV3} from 'fusion-plugin-react-router-v3-compat';
import FourOhFour from './not-found';
import {rpcIds} from '../rpc-constants';
import AppContainer from '../containers/app-container';
import TagsEditorContainer from '../containers/tags-editor-container';
import CounterContainer from '../containers/counter-container';
import ExampleErrorContainer from '../containers/example-error-container';

export default (
  <RouteV3
    path="/"
    component={AppContainer}
    dataDependency={rpcIds.getUser}
    trackingId="home"
  >
    <IndexRouteV3
      component={TagsEditorContainer}
      dataDependency={rpcIds.getTags}
      trackingId="tags-editor"
    />
    <RouteV3 path="counter" component={CounterContainer} trackingId="counter" />
    <RouteV3 path="example-error" component={ExampleErrorContainer} trackingId="error" />
    <RouteV3 path="*" component={FourOhFour} trackingId="FourOhFour" statusCode={404} />
  </Route>
)
```

---

### Limitations

The main purpose of this package is to ease the pain migrating from an existing React Router v3 project, the main goal is to not breaking the existing routes so you can gradually migrate to [`fusion-plugin-react-router`](https://engdocs.uberinternal.com/web/api/fusion-plugin-react-router) with v4 APIs. Making v3 routing API working with v4 router is very unstable and error-prone. Below is a list of features we don't support or known issues.

#### No v3 async features(code-splitting)

  React Router v3 added async features such as [`route.getComponents`](https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#getcomponentsnextstate-callback), [`route.getIndexRoute`](https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#getindexroutepartialnextstate-callback), and [`route.getChildRoutes`](https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#getchildroutespartialnextstate-callback).  Those were mainly useful for code-splitting. However, we are not supporting backward-compatabilities, as we have [first-class support for async routes with vanilla Fusion.js](https://engdocs.uberinternal.com/web/docs/guides/routing#async-loading-routes). We recommend you move off from this package and migrate to [`fusion-plugin-react-router`](https://engdocs.uberinternal.com/web/api/fusion-plugin-react-router) and [`fusion-react-async`](https://engdocs.uberinternal.com/web/api/fusion-react-async) as soon as possible if code-splitting is part of the main concerns of your application.

#### Handling no route matches/404

**If you would like a 200 response with some body rendered, do something like**
```jsx
// Routes.js

<RouteV3 path="/" component={App}>
  // ...... more routes
  <RouteV3
    path="*"
    component={FourOhFour}
    trackingId="FourOhFour"
    statusCode={404}
  />
</RouteV3>
```

**If you would like it to response with 404**
```jsx
// Routes.js
import React from 'react';
import {RouteV3} from '@uber/fusion-plugin-react-router-v3-compat';
import {Status} from 'fusion-plugin-react-router';

/* eslint-disable react/jsx-key */
export const v3Routes = [
  <RouteV3 path="/" exact component={App}>
    // ...... more routes
    <RouteV3
      path="*"
      component={FourOhFour}
      trackingId="FourOhFour"
      statusCode={404}
    />
  </RouteV3>,
  <RouteV3
    component={() => <Status code={404}>Not Found</Status>}
  />,
];
/* eslint-enable react/jsx-key */

// ///////////////////////////////////////////////////////////////

// Root.js
import React from 'react';
import {Route, Status} from 'fusion-plugin-react-router';
import {Router4Compat} from '@uber/fusion-plugin-react-router-v3-compat';
import {v3Routes} from '../shared/components/Routes';

export default (
  <Router4Compat v3Routes={v3Routes}>
    <Route component={() => <Status code={404}>Not Found</Status>} />
  </Router4Compat>
);
```

---

### Setup

#### JUST USE THE REACT COMPONENTS

This is recommended. See the ["API" section](#api) for more usage information.

```jsx
// src/shared/components/Root.js or wherever your root component may be
import React from 'react';
import {Router4Compat} from '@uber/fusion-plugin-react-router-v3-compat';
import {v3Routes} from 'Routes';

export default <Router4Compat v3Routes={v3Routes} />;
```

```jsx
// src/shared/components/Routes.js or wherever your v3 routes were defined
import React from 'react';
import {
  RouteV3,
  IndexRouteV3,
  RedirectV3,
  IndexRedirectV3,
} from '@uber/fusion-plugin-react-router-v3-compat';

export const v3Routes = (
  <RouteV3 path="/" component={App}>
    <IndexRouteV3 component={SomeIndex} />
    <RedirectV3 from="nowhere" to="somewhere" />
    <RouteV3 path="about" component={About} />
    <RouteV3 path="inbox" component={Inbox}>
      <RouteV3 path="messages/:id" component={Message} />
    </RouteV3>
  </RouteV3>
);
```

#### Use the plugin (NOT RECOMMENDED)

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

##### Router4Compat

+ `v3Rotues: RouteV3|Object` - Required. The v3 routes element tree or [`PlainRoute`](https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#plainroute).

+ `onError: func` - optional. See https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#onerrorerror

+ `children: React.Node` - optional. You may have [v4 routing components from `fusion-plugin-react-router`](https://engdocs.uberinternal.com/web/api/fusion-plugin-react-router#api). V4 components as `children` render right after v3 routes, see how `<Router4Compat>` works under the hood(illustrative):

  ```jsx
  // Illustrative
  class Router4Compat extends React.Component {
    render() {
      return (
        <div>
          <Switch>{renderCompatRoutes(this.props.v3Routes)}</Switch>
          {this.props.children}
        </div>
      );
    }
  }
  ```

  

##### RouteV3

See https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#route

##### IndexRouteV3

See https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#indexroute-1

##### RedirectV3

See https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#redirect

##### IndexRedirectV3

See https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#indexredirect

##### Plugin

```js
import RouterV3Compat from 'fusion-plugin-react-router';
```

The plugin. It's NOT recommendedto use the plugin and you should use the components listed above instead.

---

### Credits

This package is heavily inspired by https://github.com/vipcxj/react-router-4-compat