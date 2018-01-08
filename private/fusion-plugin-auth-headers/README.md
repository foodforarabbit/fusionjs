# @uber/fusion-plugin-auth-headers

---

### Overview

Exposes an API for accessing common authentication fields.

### API

* `get(key: 'uuid' | 'email' | 'token' | 'roles' | 'groups') : string` - provides the associated authentication parameter value if found.  Throws `MissingXAuthParamError` otherwise.

### Usage Example

```js
// src/main.js
import AuthHeaders from '@uber/fusion-plugin-auth-headers';
import authDevConfig from './config/auth.js';
// ...
app.plugin(AuthHeaders, authDevConfig);
// ...

// src/config/auth.js
export default {
  uuid: 'your uuid here',
};
```

```
# .gitignore
src/config/auth.js
```

### Config

As shown above, an optional configuration may be supplied which provides overrides that can be used in development environments only.  Note that in production, the configuration overrides are ignored by the plugin.

In development, it is recommended that you supply overrides as the authentication headers will not be populated otherwise.  You can find your UUID on [whober](https://whober.uberinternal.com/).
