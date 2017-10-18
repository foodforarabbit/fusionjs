# @uber/graphene-secrets-client

Provides access to secrets in Uber production environments.

---

### Example

```js
// main.js
import App from '@graphene/core';
import SecretsPlugin from '@uber/graphene-secrets-client';

export default function() {
  // ... Setup graphene app

  // Setup Secrets plugin
  const Secrets = app.plugin(SecretsPlugin, {
    devValues:
      __DEV__ &&
      {
        /* values to use in development */
      },
  });

  // Using secrets - only possible on the server
  if (__NODE__) {
    await Secrets.of().init();
    Secrets.of().get('secret.key');
  }

  // ... Configuration of other plugins
}
```

---

### API

* `devValues` - Values to use in development environments. Must be specified when not in production. Cannot be specified when in production.

* `get(key, defaultValue)` - Matches the API of of [`dottie.get`](https://www.npmjs.com/package/dottie#get-value)

---

