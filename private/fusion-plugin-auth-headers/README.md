# @uber/fusion-plugin-auth-headers

---

### Overview

Exposes an API for accessing common authentication fields.

### API

* `get(key: 'uuid' | 'email' | 'token' | 'roles' | 'groups') : string` - provides the associated authentication parameter value if found.  Throws `MissingXAuthParamError` otherwise.

### Usage Example

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
app.plugin(AuthHeaders, authDevConfig);
// ...

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

### Config

As shown above, an optional configuration may be supplied which provides overrides that can be used in development environments only.  Note that in production, the configuration overrides are ignored by the plugin.

In development, it is recommended that you supply overrides as the authentication headers will not be populated otherwise.  You can find your UUID on [whober](https://whober.uberinternal.com/).
