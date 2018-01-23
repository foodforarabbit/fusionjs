# @uber/fusion-plugin-secrets

Provides access to secrets in Uber production environments.

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

* `get(key, defaultValue)` - Matches the API of of [`dottie.get`](https://www.npmjs.com/package/dottie#get-value)

---

