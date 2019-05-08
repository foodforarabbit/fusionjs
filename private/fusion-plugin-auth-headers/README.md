# @uber/fusion-plugin-auth-headers

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Provides a plugin that exposes a programmatic interface for accessing common Uber-specific authentication fields.

At Uber, applications often need to know information about the authenticated user.  This server-side plugin provides a programatic interface that allows for accessing Uber-specific authentication fields.

In production, these are populated at the nginx layer for both internal and external apps.  As the development environment is not behind _uber.onelogin.com_, an optional development override may be provided to supply configurable values to your app.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
  * [Simple middleware](#simple-middleware)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`AuthHeadersUUIDConfigToken`](#authheadersuuidconfigtoken)
    * [`AuthHeadersEmailConfigToken`](#authheadersemailconfigtoken)
    * [`AuthHeadersTokenConfigToken`](#authheaderstokenconfigtoken)
    * [`AuthHeadersRolesConfigToken`](#authheadersrolesconfigtoken)
    * [`AuthHeadersGroupsConfigToken`](#authheadersgroupsconfigtoken)
  * [Service API](#service-api)
* [Configuration](#configuration)

---

### Installation

```sh
yarn add @uber/fusion-plugin-auth-headers
```

---

### Usage

#### Simple middleware

The plugin provides a request-scoped programmatic interface which allows for accessing information about the authenticated user.

```js
// src/some-middleware-plugin.js
import {createPlugin} from 'fusion-core';
export default createPlugin({
  deps: {authHeaders: AuthHeadersToken},
  middleware: ({authHeaders}) => {
    return (ctx, next) => {
      if(__NODE__) {
        const instance = authHeaders.from(ctx);
        const uuid = instance.get('uuid');
        ctx.body = {
          message: `User UUID is: ${uuid}`
        };
      }
      return next();
    }
  }
});
```

#### Inject UUID into Redux Store

You may wish to expose these headers for use directly within React components.  One method for achieving this involves injecting headers into the Redux store and then connecting your component to your store:

```js
// src/main.js
import { GetInitialStateToken } from 'fusion-plugin-react-redux';
import { getInitialState } from './redux.js';
...
app.register(GetInitialStateToken, getInitialState);

// src/redux.js
const getInitialState = createPlugin({
  deps: {
    headers: AuthHeadersToken,
  },
  provides: ({headers}) => {
    return async function getInitialState(ctx?: Context) {
      return {
        ...defaultState,
        user: {
          ...defaultState.user,
          uuid: headers.from(ctx).get('uuid'),
        },
      };
    };
  },
});
export {getInitialState};

// src/components/some-component.js
const SomeComponent = props => { <div>{props.user.uuid}</div> };
export default connect(({user}) => { return {user}; })(SomeComponent);
```

For a concrete example, see [example-trips-viewer-fusion](https://code.uberinternal.com/diffusion/WEEXAZJ/).

---

### Setup

```js
// src/main.js
import AuthHeadersPlugin, {
  AuthHeadersToken,
  AuthHeadersUUIDConfigToken,
  AuthHeadersEmailConfigToken,
  AuthHeadersTokenConfigToken,
  AuthHeadersRolesConfigToken,
  AuthHeadersGroupsConfigToken
} from '@uber/fusion-plugin-auth-headers';
import authDevConfig from './config/auth.js';
// ...
export default () => {
  const app = new App();
  // ...
  app.register(AuthHeadersToken, AuthHeadersPlugin);
  app.register(AuthHeadersUUIDConfigToken, authDevConfig.uuid); // optional
  app.register(AuthHeadersEmailConfigToken, authDevConfig.email); // optional
  app.register(AuthHeadersTokenConfigToken, authDevConfig.token); // optional
  app.register(AuthHeadersRolesConfigToken, authDevConfig.roles); // optional
  app.register(AuthHeadersGroupsConfigToken, authDevConfig.groups); // optional
  // ...

  return app;
};

// src/config/auth.js
/*
 * WARNING
 *
 * Changes to this file that include sensitive materials should not be committed
 * to the repository.  If you decide to make changes, consider using the 'skip-worktree'
 * flag in git:
 *
 * e.g. 'git update-index --skip-worktree src/config/auth-headers.js'
 *
 * More details: https://git-scm.com/docs/git-update-index#git-update-index---no-skip-worktree
 */
export default {
  uuid: 'some-uuid',
  email: 'some-e-mail',
  token: 'some-token',
  roles: 'some-roles',
  groups: 'some-groups'
};
```

---

### API

#### Registration API

```js
import {
  AuthHeadersUUIDConfigToken,
  AuthHeadersEmailConfigToken,
  AuthHeadersTokenConfigToken,
  AuthHeadersRolesConfigToken,
  AuthHeadersGroupsConfigToken
} from '@uber/fusion-plugin-auth-headers';
```

##### `AuthHeadersUUIDConfigToken`
```js
import {AuthHeadersUUIDConfigToken} from '@uber/fusion-plugin-auth-headers';
```

Allows for overriding the user's UUID in development environments only.  Optional.  Server-side only.

Expects a `string`, otherwise no override is used.

##### `AuthHeadersEmailConfigToken`
```js
import {AuthHeadersEmailConfigToken} from '@uber/fusion-plugin-auth-headers';
```

Allows for overriding the user's e-mail in development environments only.  Optional.  Server-side only.

Expects a `string`, otherwise no override is used.

##### `AuthHeadersTokenConfigToken`
```js
import {AuthHeadersTokenConfigToken} from '@uber/fusion-plugin-auth-headers';
```

Allows for overriding the user's token in development environments only.  Optional.  Server-side only.

Expects a `string`, otherwise no override is used.

##### `AuthHeadersRolesConfigToken`
```js
import {AuthHeadersRolesConfigToken} from '@uber/fusion-plugin-auth-headers';
```

Allows for overriding the user's roles in development environments only.  Optional.  Server-side only.

Expects a `string`, otherwise no override is used.

##### `AuthHeadersGroupsConfigToken`
```js
import {AuthHeadersGroupsConfigToken} from '@uber/fusion-plugin-auth-headers';
```

Allows for overriding the user's groups in development environments only.  Optional.  Server-side only.

Expects a `string`, otherwise no override is used.

#### Service API

```js
class AuthHeaders {
  constructor(ctx: Context, devOverrideConfig: AuthHeadersConfig): AuthHeaders
  get(key: AuthHeaderKey): string
}
type AuthHeadersService = {from: (ctx: Context) => AuthHeaders};
```

* `service.from(ctx: Context) => AuthHeaders` - provides a `Context`-scoped instance of `AuthHeaders`.
  * `ctx: FusionContext` - Required. A [FusionJS context](https://github.com/fusionjs/fusionjs/tree/master/fusion-core#context) object.
  * `instance.get(key: 'uuid' | 'email' | 'token' | 'roles' | 'groups') : string` - provides the associated authentication parameter value if found.  Returns an empty string `''` otherwise.

---

### Configuration

As shown above, an optional configuration may be supplied which provides overrides that can be used in development environments only.  Note that in production, the configuration overrides are ignored by the plugin.

In development, it is recommended that you supply overrides as the authentication headers will not be populated otherwise.  You can find your UUID on [whober](https://whober.uberinternal.com/).
