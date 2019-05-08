# @uber/fusion-plugin-secrets

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)


**Note: The plugin is currently [Langley](https://code.uberinternal.com/w/projects/security/langley/) based and will be migrated to [uSecret](https://engdocs.uberinternal.com/goldstar/how_to_items/secrets_access.html)**

Provides access to secrets in Uber production environments. Also exports a development-use token to provide mock secrets outside of a production enviroment.

---

### Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Setup](#setup)
- [API](#api)
  - [Registration API](#registration-api)
    - [`SecretsPlugin`](#secretsplugin)
    - [`SecretsToken`](#secretstoken)
  - [Dependencies](#dependencies)
    - [`DevSecretsToken`](#devsecretstoken)
    - [`SecretsLocationToken`](#secretslocationtoken)
  - [Service API](#service-api)

---

### Installation

```sh
yarn add @uber/fusion-plugin-secrets
```

---

### Usage

```js
__NODE__ && app.middleware({secrets: SecretsToken}, ({secrets}) => {
  const mySecret = secrets.get('some-key', 'default-value');
  // ...
});
```

---

### Setup

```js
// main.js
import SecretsPlugin, {
  DevSecretsToken,
  SecretsToken,
} from '@uber/fusion-plugin-secrets';

app.register(SecretsToken, SecretsPlugin);
__DEV__ && app.register(DevSecretsToken, {devSecret: 'values'});
```

---

### API

#### Registration API

##### `SecretsPlugin`
The Secrets plugin.  Provides the Secrets [service API](#service-api).

##### `SecretsToken`
The canonical token for the Secrets plugin. Typically, it should be registered with the [SecretsPlugin](#secretsplugin) plugin.

#### Dependencies

##### `DevSecretsToken`
**Required.** Secrets to be used during development.  Development environment only.

##### `SecretsLocationToken`
Optional. Path used to find production secrets.  Production environment only. Defaults to  `config/secrets/secrets.json`

#### Service API

`Secrets.get(key, defaultValue)` - Matches the API of of [`dottie.get`](https://www.npmjs.com/package/dottie#get-value).
