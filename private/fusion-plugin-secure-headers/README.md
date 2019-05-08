# @uber/fusion-plugin-secure-headers

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Improves the web application security by setting headers, such as Content Security Policy, X-Frame-Options, etc.

By default it turns on [frameguard](https://helmetjs.github.io/docs/frameguard/) to protect against [clickjacking attacks](https://en.wikipedia.org/wiki/Clickjacking), and uses a default Uber content security policy to mitigate [cross-site scripting (XSS) attacks](https://en.wikipedia.org/wiki/Cross-site_scripting).

To understand more about Content Security Policy, see [https://helmetjs.github.io/docs/csp/](https://helmetjs.github.io/docs/csp/)

This library uses `koa-helmet`.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`SecureHeaders`](#secureheaders)
    * [`SecureHeadersToken`](#secureheaderstoken)
  * [Dependencies](#dependencies)
    * [`SecureHeadersUseFrameguardConfigToken`](#secureheadersuseframeguardconfigtoken)
    * [`SecureHeadersFrameguardAllowFromDomainConfigToken`](#secureheadersframeguardallowfromdomainconfigtoken)
    * [`SecureHeadersCSPConfigToken`](#secureheaderscspconfigtoken)

---

### Installation

```sh
yarn add @uber/fusion-plugin-secure-headers
```

---

### Usage

```js
// src/config/secure-headers.js
export default {
  csp: {
    /*
                                Uses a secure policy. Recommended.
                                It allows the execution of scripts dynamically added to the page,
                                as long as they were loaded by a safe, already-trusted script.
                                */
    useStrictDynamicMode: true,

    /*
                                An array of names of analytics services for their assets to be whitelisted.
                                Google Analytics is currently included by default.
                                Valid service names: "tealium" | "mixpanel" | "googleAnalytics" | "googleTagManager"
                                */
    analyticsServiceNames: ['googleAnalytics', 'tealium'],
  },
};
```

#### Resources

* [Google CSP Guide](https://csp.withgoogle.com/docs/index.html)
* [MDN docs on CSP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)
* [HelmetJS](https://helmetjs.github.io/)

---

### Setup

```js
// src/main.js
import React from 'react';
import SecureHeaders, {
  SecureHeadersToken,
  SecureHeadersUseFrameguardConfigToken,
  SecureHeadersCSPConfigToken,
} from '@uber/fusion-plugin-secure-headers';
import secureHeadersConfig from './config/secure-headers.js';

export default () => {
  const app = new App(<Home />);

  app.register(SecureHeadersToken, SecureHeaders);
  app.register(SecureHeadersCSPConfigToken, secureHeadersConfig.csp);

  return app;
};
```

---

### API

#### Registration API

##### `SecureHeaders`

```js
import SecureHeaders from 'fusion-plugin-secure-headers';
```

The plugin. Should be registered to [`SecureHeadersToken`](#secureheaderstoken)

##### `SecureHeaderToken`

```js
import {SecureHeaderToken} from 'fusion-plugin-secure-headers';
```

Should be registered with [`SecureHeaders`](#secureheaders)

#### Dependencies

##### `SecureHeadersUseFrameguardConfigToken`

```js
import {SecureHeadersUseFrameguardConfigToken} from 'fusion-plugin-secure-headers';
```

Optional. Server-only. Determines whether to use x-frame-options headers. Defaults to `true`.


##### `SecureHeadersFrameguardAllowFromDomainConfigToken`

```js
import {SecureHeadersFrameguardAllowFromDomainConfigToken} from 'fusion-plugin-secure-headers';
```

Optional. Server-only. A plugin that returns a string that is set as the domain/origin for x-frame-options ALLOW-FROM.
If the plugin returns null, defaults to SAMEORIGIN. If `SecureHeadersUseFrameguardConfigToken` is false, this token is ignored.

##### `SecureHeadersCSPConfigToken`

```js
import {SecureHeadersCSPConfigToken} from 'fusion-plugin-secure-headers';
```

Optional. Server-only. Content security policy configuration. Defaults to an empty object. This token can be registered as a value, or as a function that returns an object that conforms to `CSPConfig`. This allows for dynamic setup of Content Security Policies, possibly from a `Plugin`.

###### Types

```js
type CSPConfig = {
  overrides: ?Object<string, Array<string>>,
  reportUri: ?string,
  intentionallyRemoveAllSecurity: ?boolean,
  useStrictDynamicMode: ?boolean,
  allowInsecureContent: ?boolean,
  allowMixedContent: ?boolean,
  analyticsServiceNames: ?Array<string>,
};
```

* `overrides` - Overrides directives. See the `directives` property in [https://helmetjs.github.io/docs/csp/](https://helmetjs.github.io/docs/csp/). Optional.
* `reportUri` - The `directives.reportUri` property in [https://helmetjs.github.io/docs/csp/](https://helmetjs.github.io/docs/csp/). Optional. Defaults to a auto-generate uri.
* `intentionallyRemoveAllSecurity` - Removes security and uses report-only mode instead. Optional. Defaults to false.
* `useStrictDynamicMode` - If true, uses a [strict policy](https://code.uberinternal.com/diffusion/WEFUSGY/browse/master/src/csp/policies/strict.js), otherwise it uses the default [Uber policy](https://code.uberinternal.com/diffusion/WEFUSGY/browse/master/src/csp/policies/uber-default.js). The chosen policy can still be overriden via `overrides`. Optional. Defaults to false.
* `allowInsecureContent` - If true, removes the `blockAllMixedContent` from the policy. Optional. Defaults to false.
* `allowMixedContent` - Alias for `allowInsecureContent`.
* `analyticsServiceNames` - A list of analytics service names. Optional. Defaults to `['googleAnalytics']`


###### Examples

An example of dynamic setup of Content Security Policies using a dependency enhancer:

```js
app.enhance(SecureHeadersCSPConfigToken, csp => {
  return createPlugin({
    deps: {
      customerConfig: CustomerConfigToken,
    },
    provides: ({customerConfig}) => (ctx: Context): CSPConfig => {
      const config = customerConfig.loadCustomerConfig(ctx);
      csp.overrides.frameAncestors = config.frameAncestors;
      return csp;
    },
  });
});
```
