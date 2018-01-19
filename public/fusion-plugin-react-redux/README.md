# fusion-plugin-react-redux

[![Build status](https://badge.buildkite.com/b1165dac1a1aea4fee2d97e52c74f5101efeed82f6907bb16c.svg?branch=master)](https://buildkite.com/uberopensource/fusion-plugin-react-redux?branch=master)

Integrates React and Redux to a FusionJS application

It handles creating your store, wrapping your element tree in a provider, and serializing/deserializing your store between server and client.

---

### Installation

```sh
yarn add fusion-plugin-react-redux
```

---

### Example

```js
// in your main.js file
import React from 'react';
import Redux, {ReduxToken, ReducerToken, EnhancerToken, InitialStateToken} from 'fusion-plugin-react-redux';
import App from 'fusion-react';
import reducer from './reducer';
import enhancer from './enhancer';

export default function start() {
  const app = new App(root);
  app.register(ReduxToken, Redux);
  app.register(ReducerToken, reducer);
  app.register(EnhancerToken, enhancer);
  __NODE__ && app.register(InitialStateToken, async getInitialState(ctx) {
    return {};
  });

  return app;
}

// reducer.js file
export default (state, action) => {
  return state;
};
```

---

### API

#### Dependency registration

```js
import Redux, {ReduxToken, ReducerToken, EnhancerToken, InitialStateToken} from 'fusion-plugin-react-redux';

app.register(ReduxToken, Redux);
app.register(ReducerToken, reducer);
app.register(EnhancerToken, enhancer);
__NODE__ && app.register(InitialStateToken, getInitialState);
```

Creates the redux store and integrates it into the Fusion application

- `Redux` - The Redux plugin
- `reducer: (state: any, action: Object) => any` - required. The root reducer
- `preloadedState: any` - optional. Overrides the initial state in the server, and the hydrated state in the client
- `enhancer: (arg: any) => any` - optional. Enhances the store with 3rd party capabilities, such as middlewares, time travel, persistence, etc. If you're using `applyMiddleware`, pass it to this option (i.e `{enhancer: applyMiddleware(myMiddleware)}`). You can also compose multiple enhancers (e.g. `{enhancer: compose(applyMiddleware(myMiddleware), anotherEnhancer)`)
- `getInitialState: (ctx) => Promise<any>` - optional. A function that returns the initial state for your redux store.

#### Factory

`const redux = Redux.from(ctx);`

- `ctx: FusionContext` - Required. A [FusionJS Context](https://github.com/fusionjs/fusion-core#context).
- `redux: {initStore, store}`
  - `initStore: () => Promise<ReduxStore>` - Runs `getInitialState` and populates the store asynchronously.
  - `store: ReduxStore` - A [Redux store](https://redux.js.org/docs/api/Store.html)

---

### Redux Devtools integration

The plugin automatically integrates with the [redux devtools Chrome extension](https://github.com/zalmoxisus/redux-devtools-extension)

---

### `store.ctx` - Enhancers have access to `ctx`

For convenience, Redux stores are composed with a default right-most enhancer to add `store.ctx` along side with other [Store APIs](https://github.com/reactjs/redux/blob/master/docs/api/Store.md).
This is particular useful for your custom store enhancers to access to `ctx` for use-cases such as logging, analytics...etc.

See [redux-action-emitter-enhancer](https://github.com/fusionjs/fusion-redux-action-emitter-enhancer/) for an usage example.
