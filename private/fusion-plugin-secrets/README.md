# @uber/fusion-plugin-secrets

Provides access to secrets in Uber production environments.

---

### Installation

```sh
yarn add @uber/fusion-plugin-secrets
```

---

### Example

```js
// main.js
import SecretsPlugin, {
  DevSecretsToken,
  SecretsToken,
} from '@uber/fusion-plugin-secrets';

app.register(SecretsToken, SecretsPlugin);
__DEV__ && app.register(DevSecretsToken, {dev: 'values'});

__NODE__ && app.middleware({secrets: SecretsToken}, ({secrets}) => {
  const result = secrets.get('some-key', 'default-value');
  // ...
});
```

---

### API

#### Dependency registration

```js
// src/main.js
import {DevSecretsToken, SecretsToken} from '@uber/fusion-plugin-secrets';

__DEV__ && app.register(DevSecretsToken, /*some secrets*/);
app.register(SecretsLocationToken, /*some path*/);
```

##### Required dependencies

Name | Type | Description
-|-|-
`DevSecretsToken` | `Object` | Secrets to be used during development.  Development environment only.

##### Optional dependencies

Name | Type | Default | Description
-|-|-|-
`SecretsLocationToken` | `string` | `config/secrets/secrets.json` | Path used to find production secrets.  Production environment only.

#### Service API

* `get(key, defaultValue)` - Matches the API of of [`dottie.get`](https://www.npmjs.com/package/dottie#get-value).
