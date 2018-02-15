# @uber/fusion-plugin-tealium

Tealium plugin for Fusion

---

### Installation

```sh
npm install @uber/fusion-plugin-tealium
```

---

### Example

```js
// src/main.js
import App from 'fusion-react';
import TealiumPlugin, {
    TealiumToken,
    TealiumConfigToken
} from '@uber/fusion-plugin-tealium';

export default () => {
  const app = new App();
  // ...
  app.register(TealiumToken, TealiumPlugin);
  app.register(TealiumConfigToken, {/*some config*/});
  // ...
  return app;
}
```
