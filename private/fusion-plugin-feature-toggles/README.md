# @uber/fusion-plugin-feature-toggles

Adds Feature Toggle support to a Fusion.js app.

Feature toggles (also known as feature flags) provide developers with the ability to rapidly toggle specific features or code in their Fusion.js applications.  This package supports the following use cases:

* A/B Toggles, or broader experimentation toggles, allow for conducting experiments by delivering certain functionality to a consistent subset of users for a prolonged period of time.  When used in conjunction with an experimentation service, data gathered during this period can be analyzed to either accept or reject test hypotheses.  Lifetime is generally on the order of weeks or months.
* Rollout Toggles can act as a defence against shipping broken code, by enabling functionality for a small subset of consumers and then ramping up which consumers have the functionality enabled at some cadence until it has rolled out everywhere.  Lifetime is generally short.
* Release Toggles allow incomplete code to safely ship to production behind a disabled toggle until such a time that it can be released, and the toggle is enabled.  Lifetime is variable, depending upon the length of development for the feature in question.
* Runtime Toggles, or operations toggles, are similar to rollout toggles in that they can rapidly disable recently shipped code at runtime if issues arise (e.g. broken or non-performant code).  Lifetime is generally short and tied to specific releases.
* Permissioning Toggles allow certain production-ready code to be enabled for only a subset of consumers.  Lifetime is generally long, as these may persist as long as the feature in question is in production.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
  * [Simple middleware](#simple-middleware)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`FeatureTogglesPlugin`](#feature-toggles-plugin)
    * [`FeatureTogglesToken`](#feature-toggles-token)
  * [Dependencies](#dependencies)
    * [`FeatureTogglesToggleNamesToken`](#feature-toggles-toggle-names-token)
    * [`FeatureTogglesClientToken`](#feature-toggles-client-token)
    * [`AtreyuToken`](#atreyutoken)
  * [Service API](#service-api)
* [Morpheus](#morpheus)

---

### Installation

```sh
yarn add @uber/fusion-plugin-feature-toggles
```

---

### Usage

#### Simple middleware

The plugin provides a programmatic interface which exposes `get`. See [Service API](#service-api) for more details.

```js
// src/some-middleware-plugin.js
import {createPlugin} from 'fusion-core';
import {FeatureTogglesToken} from '@uber/fusion-plugin-feature-toggles';

export default createPlugin({
  deps: {featureToggles: FeatureTogglesToken},
  middleware: ({featureToggles}) => {
    return (ctx, next) => {
      if (__NODE__ && ctx.path === '/some-path') {
        const instance = featureToggles.from(ctx);
        const showHelloWorld = instance.get('showHelloWorldToggle');
        if(showHelloWorld.enabled) {
          ctx.body = { message: 'hello world!' };
        }
      }
      return next();
    };
  },
});
```

The default backend service for this plugin is Morpheus.  See [Morpheus](#morpheus) for more details.

---

### Setup

```js
// src/app.js
import App from 'fusion-core';
import FeatureTogglesPlugin, {
  FeatureTogglesToggleNamesToken,
  FeatureTogglesToken,
} from '@uber/fusion-plugin-feature-toggles';
import AtreyuPlugin, {AtreyuToken} from '@uber/fusion-plugin-atreyu';

export default () => {
  const app = new App(<div />);

  app.register(FeatureTogglesToken, FeatureTogglesPlugin);
  if(__NODE__) {
    app.register(AtreyuToken, AtreyuPlugin);
    app.register(FeatureTogglesToggleNamesToken, ['some-toggle-name']);
  }
  
  return app;
};
```

---

### API

#### Registration API

##### `FeatureTogglesPlugin`

```js
import FeatureTogglesPlugin from '@uber/fusion-plugin-feature-toggles';
```

The feature toggles plugin. Typically, it should be registered to [`FeatureTogglesToken`](#feature-toggles-token). Provides the [feature toggles service](#service-api).

##### `FeatureTogglesToken`

```js
import {FeatureTogglesToken} from '@uber/fusion-plugin-feature-toggles';
```

The canonical token for the feature toggles plugin. Typically, it should be registered with the [`FeatureTogglesPlugin`](#feature-toggles-plugin) plugin.

#### Dependencies

##### `FeatureTogglesToggleNamesToken`

```js
import {FeatureTogglesToggleNamesToken} from '@uber/fusion-plugin-feature-toggles';
```

Required.  A list of names corresponding to the toggles used in the app.

###### Type

```js
type FeatureTogglesToggleNames = Array<string>;
```

##### `FeatureTogglesClientToken`

```js
import {FeatureTogglesClientToken} from '@uber/fusion-plugin-feature-toggles';
```

Optional.  An optional client to provide details on requested toggles.  Should implement `IFeatureTogglesClient`.  Defaults to a [Morpheus client](#morpheus) if no client is provided.

###### Type

```js
interface IFeatureTogglesClient {
  +get: (toggleName: string) => Promise<?{|
    +enabled: boolean,
    +metadata?: {[string]: any},
  |}>;
}
```

###### Default value

If no client is provided, the default client interfaces with Morpheus. See [src/clients/morpheus.js](https://github.com/fusionjs/fusion-plugin-feature-toggles/blob/master/src/clients/morpheus.js) for more details.

##### `AtreyuToken`

```js
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
```

See
[`AtreyuToken`](https://engdocs.uberinternal.com/web/api/uber-fusion-plugin-atreyu#atreyutoken)

#### Service API

```js
type FeatureTogglesServiceType = {|
  +from: (ctx?: Context) => {|
    +get: (toggleName: string) => Promise<?{|
      +enabled: boolean,
      +metadata?: {[string]: any}, 
    |}>;
  |},
|};
```

* `from: (ctx?: Context) => ...` - Scopes the service to a specific request (via `Context`).
* `get(toggleName: string) => ...` - Gets toggle information for the provided toggle. 
  * `+enabled: boolean` - Whether or not the requested toggle is enabled.
  * `+metadata?: {[string]: any}` - Additional information provided by the specific Client being used (e.g. Morpheus may provide some experimentation-specific properties).

---

#### Morpheus

Morpheus is Uber's management UI for configuring and managing experiments.  It promotes best practices around experimentation and and can feed into the analytics platform, Mentana.

If no client is registered to the `FeatureTogglesClientToken`, this plugin defaults to using a lightweight Morpheus client to handle toggle configuration.  See [src/clients/morpheus.js](https://github.com/fusionjs/fusion-plugin-feature-toggles/blob/master/src/clients/morpheus.js) for more details.

A toggle is always in a binary state of on or off.  For the default client, we consider users in a treatment group as "on" and those in control as "off".  In both of these cases, additional metadata is provided by Morpheus and returned by the plugin service.  If a user is not a part of any treatment or control group, the toggle defaults to "off" and no additional metadata is provided.

We are also opinionated on the constraints used to identify (and optionally segment) users.  These are:
   * `browser: string` - browser client from the request
   * `url: string` - request URL
   * `urlParameters: {[key: string]: string}` - parameters embedded in the request URL
   * `deviceLanguage: string` - Locale string from the request's 'accept-language' header
   * `ipAddress: string` - IP address from the request
   * `cookieID: string` - UUID4 corresponding to a specific user
