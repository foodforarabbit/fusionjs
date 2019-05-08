# @uber/fusion-plugin-feature-toggles

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Adds Feature Toggle support to a Fusion.js app.

Feature toggles (also known as feature flags) provide developers with the ability to rapidly toggle specific features or code in their Fusion.js applications.  This package supports the following use cases:

* A/B Toggles, or broader experimentation toggles, allow for conducting experiments by delivering certain functionality to a consistent subset of users for a prolonged period of time.  When used in conjunction with an experimentation service, data gathered during this period can be analyzed to either accept or reject test hypotheses.  Lifetime is generally on the order of weeks or months.
* Rollout Toggles can act as a defence against shipping broken code, by enabling functionality for a small subset of consumers and then ramping up which consumers have the functionality enabled at some cadence until it has rolled out everywhere.  Lifetime is generally short.
* Release Toggles allow incomplete code to safely ship to production behind a disabled toggle until such a time that it can be released, and the toggle is enabled.  Lifetime is variable, depending upon the length of development for the feature in question.
* Runtime Toggles, or operations toggles, are similar to rollout toggles in that they can rapidly disable recently shipped code at runtime if issues arise (e.g. broken or non-performant code).  Lifetime is generally short and tied to specific releases.
* Permissioning Toggles allow certain production-ready code to be enabled for only a subset of consumers.  Lifetime is generally long, as these may persist as long as the feature in question is in production.

If you're using React, you should use [fusion-plugin-feature-toggles-react](https://code.uberinternal.com/diffusion/WEFUSSK/) instead of this package.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
  * [Simple middleware](#simple-middleware)
  * [Default client](#default-client)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`FeatureTogglesPlugin`](#feature-toggles-plugin)
    * [`FeatureTogglesToken`](#feature-toggles-token)
  * [Dependencies](#dependencies)
    * [`FeatureTogglesTogglesConfigToken`](#feature-toggles-toggles-config-token)
    * [`FeatureTogglesClientToken`](#feature-toggles-client-token)
    * [`FeatureTogglesClientConfigToken`](#feature-toggles-client-config-token)
    * [`AtreyuToken`](#atreyutoken)
  * [Service API](#service-api)
* [Morpheus](#morpheus)
  * [Configuration](#configuration)
* [Roadmap](#roadmap)

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

#### Default client

The default backend service for this plugin is Morpheus.  See [Morpheus](#morpheus) for more details.

---

### Setup

```js
// src/app.js
import App from 'fusion-core';
import FeatureTogglesPlugin, {
  FeatureTogglesTogglesConfigToken,
  FeatureTogglesToken,
} from '@uber/fusion-plugin-feature-toggles';
import AtreyuPlugin, {AtreyuToken} from '@uber/fusion-plugin-atreyu';

export default () => {
  const app = new App(<div />);

  app.register(FeatureTogglesToken, FeatureTogglesPlugin);
  if(__NODE__) {
    app.register(AtreyuToken, AtreyuPlugin); // required only if using default Morpheus client
    app.register(FeatureTogglesTogglesConfigToken, ['some-toggle-name']);
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

##### `FeatureTogglesTogglesConfigToken`

```js
import {FeatureTogglesTogglesConfigToken} from '@uber/fusion-plugin-feature-toggles';
```

Required.  A list of names or configuration objects corresponding to the toggles used in the app.

If a config object is supplied, an optional `exposeToClient` property can be set which limits the exposure of the toggle details to the server-only.

###### Type

```js
type FeatureToggleConfigType = {
  +name: string,
  +exposeToClient?: boolean,
};

type FeatureTogglesToggleNames = Array<FeatureToggleConfigType | string>;
```

##### `FeatureTogglesClientToken`

```js
import {FeatureTogglesClientToken} from '@uber/fusion-plugin-feature-toggles';
```

Optional.  An optional client to provide details on requested toggles.  Should implement `IFeatureTogglesClient`.  Defaults to a [Morpheus client](#morpheus) if no client is provided.

###### Type

```js
interface IFeatureTogglesClient {
  constructor(...params?: any): IFeatureTogglesClient;
  +load: () => Promise<void>;
  +get: (toggleName: string) => {|
    +enabled: boolean,
    +metadata?: {[string]: any},
  |};
}
```

- `load` is called once as part of the plugin middleware prior to rendering.  See the [documentation](https://engdocs.uberinternal.com/web/docs/guides/creating-a-plugin#request-lifecycle) for more details on the life cycle of an HTTP request.
- `get` provides details on toggle corresponding to the supplied `toggleName`.  In the simplest case, this yields whether the toggle is enabled.  Additional metadata may be supplied by the client implementation.

###### Default value

If no client is provided, the default client interfaces with Morpheus. See [src/clients/morpheus.js](https://github.com/fusionjs/fusion-plugin-feature-toggles/blob/master/src/clients/morpheus.js) for more details.

##### `FeatureTogglesClientConfigToken`

```js
import {FeatureTogglesClientConfigToken} from '@uber/fusion-plugin-feature-toggles';
```

Optional.  An optional client configuration objects that is passed into the Client (registered to `FeatureToggleClientToken`) during instantiation.

The default Morpheus client supports some [configuration](#configuration).

###### Type

```js
type FeatureTogglesClientConfigToken = {+[string]: any};
```

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
    +get: (toggleName: string) => {|
      +enabled: boolean,
      +metadata?: {[string]: any}, 
    |};
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

We are also opinionated on the constraints used to identify (and optionally segment) users by default.  These are:
   * `browser: string` - browser client from the request
   * `url: string` - request URL
   * `urlParameters: {[key: string]: string}` - parameters embedded in the request URL
   * `deviceLanguage: string` - Locale string from the request's 'accept-language' header
   * `ipAddress: string` - IP address from the request
   * `cookieID: string` - UUID4 corresponding to a specific user, if available, otherwise the the user's 'marketing_vistor_id'.  Defaults to the empty string otherwise.

##### Configuration

```js
type MorpheusContextType = { // detailed above
  +browser: string,
  +url: string,
  +urlParameters: {[key: string]: string},
  +deviceLanguage: string,
  +ipAddress: string,
  +cookieID: string,
};

type MorpheusConfigType = {
  +enhanceContext?: (
    ctx: Context,
    defaultMorpheusContext: MorpheusContextType
  ) => {+[string]: any},
  +metadataTransform?: MorpheusTreatmentGroupType => {+[string]: any},
  +timeoutThreshold?: number,
};
```

###### `enhanceContext`

An optional `enhanceContext` function can be supplied for the default Morpheus client in order to extend the opinionated constraints from above.  This config object must be registered to the `FeatureTogglesClientConfigToken` token.  For example, if it were necessary to overwrite the `cookieID` property and add a `marketingID` property, we might do something like:

```js
const config = {
  enhanceContext: (ctx, defaultContext) => ({
    ...defaultContext,
    cookieID: ctx.headers['user-uuid'],
    marketingID: ctx.cookies.get('some_marketing_id'),
  })
};

app.register(FeatureTogglesClientConfigToken, config);
```

###### `metadataTransform`

An optional `metadataTransform` function can be supplied that transforms Morpheus details (see [MorpheusTreatmentGroupType](https://sourcegraph.uberinternal.com/code.uber.internal/web/fusion-plugin-feature-toggles@f1b254926848cd960c4bb4952ccb22356f6108fb/-/blob/src/clients/morpheus.js#L18)).  This config object must be registered to the `FeatureTogglesClientConfigToken` token.  For example, if it were necessary to only expose `experimentID`, we might do something like:

```js
const config = {
  metadataTransform: (details) => ({
    experimentID: details.experimentID
  })
};

app.register(FeatureTogglesClientConfigToken, config);
```

###### `timeoutThreshold`

An optional timeout threshold number (in milliseconds) can be supplied to limit the amount of time to wait for a response from Morpheus.  If the threshold is exceeded, no Morpheus experiment data will be used in a request's response.  This would be the equivalent to the corresponding user not being in any active experiments.

This config object must be registered to the `FeatureTogglesClientConfigToken` token.  For example, limiting the request time to Morpheus to under 200ms, we might do something like:

```js
const config = {
  timeoutThreshold: 200,
};

app.register(FeatureTogglesClientConfigToken, config);
```

##### Installation

The default Morpheus client leverages Atreyu for its server-side communication with backend services.  This requires additional set-up outlined in the [Fusion.js fetching data guide](https://engdocs.uberinternal.com/web/docs/guides/fetching-data).

###### Fetch Treatment service Thrift definition

Run the following code:
```sh
$ npm install idl -g
$ idl fetch code.uber.internal/data/treatment
```

###### Configure Fusion.js app

Update `src/config/atreyu.js` to include the `treatment` service.  For example:
```js
export default {
  // Enumerate what backend services you are communicating with.
  // Find services at https://infra.uberinternal.com/apps/
  // Fetch the IDL files when you add new services via [idl command](t.uber.com/idl)
  serviceNames: ['treatment'], // list of downstream service names
};
```

---

#### Roadmap

A number of potential enhancements and improvements coming in the future:
- **Support server-side only toggles** to limit exposure from client side.
- **[Morpheus] Timeout threshold for requests** to mitigate slowing down generating responses.
- **[Morpheus] Robust error handling** to mitigate Morpheus outages and issues.
- **Support for React Hooks** to expose toggle service for direct consumption.
- **Improve testing** through robust exporting of mocks and types.
- **Improved out-of-the-box metric logging** for downstream analysis of toggle states (e.g. for A/B experimentation).
- **Support for Flipr back-end** as toggle configuration service.
- **Improved code splitting to only relevant toggles** for each bundle to cut down on bundle size.
- **Back-end agnostic portal to change toggle states** to improve developer experience.
