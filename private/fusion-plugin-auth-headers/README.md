# @uber/fusion-plugin-auth-headers

Exposes an API for accessing common authentication fields.

---

### Installation

```sh
yarn add @uber/fusion-plugin-auth-headers
```

---

### Example

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

  // Using auth headers
  app.middleware({Headers: AuthHeadersToken}, ({Headers}) => {
    return (ctx, next) => {
      const headers = Headers.from(ctx);
      const uuid = headers.get('uuid');
      const email = headers.get('email');
      const token = headers.get('token');
      const roles = headers.get('roles');
      const groups = headers.get('groups');
    }
  });
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

#### Dependency registration

```js
import {
  AuthHeadersUUIDConfigToken,
  AuthHeadersEmailConfigToken,
  AuthHeadersTokenConfigToken,
  AuthHeadersRolesConfigToken,
  AuthHeadersGroupsConfigToken
} from '@uber/fusion-plugin-auth-headers';

app.register(AuthHeadersUUIDConfigToken, /*some uuid)*/;
app.register(AuthHeadersEmailConfigToken, /*some email*/);
app.register(AuthHeadersTokenConfigToken, /*some token*/);
app.register(AuthHeadersRolesConfigToken, /*some roles*/);
app.register(AuthHeadersGroupsConfigToken, /*some group*/s);
```

##### Optional dependencies

Name | Type | Default | Description
-|-|-|-
`AuthHeadersUUIDConfigToken` | `string` | `undefined` | Development override value for a user's UUID.
`AuthHeadersEmailConfigToken` | `string` | `undefined` | Development override value for a user's e-mail address.
`AuthHeadersTokenConfigToken` | `string` | `undefined` | Development override value for a user's token.
`AuthHeadersRolesConfigToken` | `string` | `undefined` | Development override value for a user's roles.
`AuthHeadersGroupsConfigToken` | `string` | `undefined` | Development override value for a user's groups.

#### Service API

* `from(ctx) => instance`
* `instance.get(key: 'uuid' | 'email' | 'token' | 'roles' | 'groups') : string` - provides the associated authentication parameter value if found.  Throws `MissingXAuthParamError` otherwise.

---

### Configuration

As shown above, an optional configuration may be supplied which provides overrides that can be used in development environments only.  Note that in production, the configuration overrides are ignored by the plugin.

In development, it is recommended that you supply overrides as the authentication headers will not be populated otherwise.  You can find your UUID on [whober](https://whober.uberinternal.com/).
