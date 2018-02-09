# @uber/fusion-plugin-secure-headers

A FusionJS plugin to improve the web application security by setting headers, such as Content Security Policy, X-Frame-Options, etc.

---

### Installation

```sh
yarn add @uber/fusion-plugin-secure-headers
```

---

### Example

```js
// src/main.js
import React from 'react';
import SecureHeaders, {
  SecureHeadersToken,
  SecureHeadersUseFrameguardConfigToken,
  SecureHeadersCSPConfigToken,
} from '@uber/fusion-plugin-secure-headers';

export default () => {
  const app = new App(<Home />);
  // ...
  app.register(SecureHeadersToken, SecureHeaders);
  app.register(SecureHeadersUseFrameguardConfigToken, true); // optional
  app.register(SecureHeadersCSPConfigToken, {}); // optional
  // ...
  return app;
}
```

---

### API

#### Dependency registration

```js
// src/main.js
import {
  SecureHeadersUseFrameguardConfigToken,
  SecureHeadersCSPConfigToken,
} from '@uber/fusion-plugin-secure-headers';

app.register(SecureHeadersUseFrameguardConfigToken, /*true | false*/);
app.register(SecureHeadersCSPConfigToken, /*some config*/);
```

##### Optional dependencies

Name | Type | Default | Description
-|-|-|-
`SecureHeadersUseFrameguardConfigToken` | `boolean` | `true` | Whether or not to use [Frameguard](https://github.com/helmetjs/frameguard).
`SecureHeadersCSPConfigToken` | `SecureHeadersCSPConfig` | See below | Content Security Policy configuration.  See below for more details.

---

### Configuration

Content Security Policy configuration options are as follows:

```js
{
  overrides: {
  /* Optional. Overrides for CSP headers */
  },

  reportUri: 'https://csp.uber.com/csp?a=awesome-service&ro=true&v=0',
  /* Optional:string. When not specified the plugin generates it for you. */

  useStrictDynamicMode: true,
  /* Optional:boolean. The most secure settings.
  |  It allows the execution of scripts dynamically added to the page,
  |  as long as they were loaded by a safe, already-trusted script.
  */

  allowInsecureContent: false,
  /* Optional:boolean. Allow non-HTTPS assets when the page is loaded via HTTPS, not great.
  |  (Inverted alias for `blockAllMixedContent`)
  */

  analyticsServiceNames: ["googleAnalytics", "tealium"],
  /* Optional: AnalyticsServiceName[].
  |  An array of names of analytics services for their assets to be whitelisted.
  |  Google Analytics is currently included by default.
  |  AnalyticsServiceNames: "tealium" | "mixpanel" | "googleAnalytics" | "googleTagManager"
  */
}
```
---

### Resources

+ [Google CSP Guide](https://csp.withgoogle.com/docs/index.html)
+ [MDN docs on CSP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
+ [HelmetJS](https://helmetjs.github.io/)
