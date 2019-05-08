# @uber/fusion-plugin-error-handling

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

This is a FusionJS plugin for Uber-specific error handling.

---

### Installation

```sh
yarn add @uber/fusion-plugin-error-handling
```

---

### Example

```js
// src/main.js
import {LoggerToken} from 'fusion-tokens';
import LoggerPlugin from '@uber/fusion-plugin-logtron';
import M3Plugin {M3Token} from '@uber/fusion-plugin-m3';
import ErrorHandlingPlugin, {ErrorHandlerToken} from 'fusion-plugin-error-handling';
import UberErrorHandlingPlugin from '@uber/fusion-plugin-error-handling';

export default () => {
  const app = new App(...);
  // ...
  app.register(M3Token, M3Plugin);
  app.register(LoggerToken, LoggerPlugin);
  app.register(ErrorHandlingPlugin);
  // register handler, consumed by generic fusion-plugin-error-handling
  __NODE__ && app.register(ErrorHandlerToken, UberErrorHandlingPlugin);
  // ...
  return app;
};
```

---

### API

#### Dependency registration

```js
import {LoggerToken} from 'fusion-tokens';
import LoggerPlugin from '@uber/fusion-plugin-logtron';
import M3Plugin {M3Token} from '@uber/fusion-plugin-m3';

app.register(M3Token, M3Plugin);
app.register(LoggerToken, LoggerPlugin);
};
```

##### Required dependencies

Name | Type | Description
-|-|-
`LoggerToken` | `Logger` | A [type-compliant logger](https://github.com/fusionjs/fusionjs/tree/master/fusion-tokens/blob/master/src/index.js#L23-L32). Using [Logtron](https://code.uberinternal.com/diffusion/WEFUSTX/) is recommended for most cases at Uber.
`M3Token` | `M3Plugin` | An M3 plugin for FusionJS.  Using [@uber/fusion-plugin-m3](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-m3) is recommended for most cases at Uber.
