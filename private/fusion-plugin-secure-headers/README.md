# @uber/fusion-plugin-secure-headers

## Overview

A fusion plugin to improve the web application security by setting headers, such as Content Security Policy, X-Frame-Options...etc.

## Installation

```
npm install @uber/fusion-plugin-secure-headers
```

## Usage Example

```js
// src/main.js

import React from 'react';
import SecureHeaders, {
  SecureHeadersToken,
  SecureHeadersServiceNameConfigToken,
} from '@uber/fusion-plugin-secure-headers';

export default () => {
  const app = new App(<Home />);
  app.register(SecureHeadersToken, SecureHeaders);
  app.register(SecureHeadersServiceNameConfigToken, 'awesome-frontend');
  return app;
}
```

---

### Config Tokens
`SecureHeadersServiceNameConfigToken`

```js
'awesome-frontend'
/* Required:string */
```

`SecureHeadersUseFrameguardConfigToken`

```js
true
/* Optional:boolean. Default to true unless explictly specified as false.
|  See https://github.com/helmetjs/frameguard for more info.
*/
```

`SecureHeadersCSPConfigToken`

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

## Resources

+ [Google CSP Guide](https://csp.withgoogle.com/docs/index.html)
+ [MDN docs on CSP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
+ [HelmetJS](https://helmetjs.github.io/)
