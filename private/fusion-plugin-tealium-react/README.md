# @uber/fusion-plugin-tealium-react

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Tealium plugin for Fusion.js with React

Tealium is a tag management tool for marketers that provides control over third-party tracking pixels, making it easier for non-engineers to tie ads and pages together and quantify conversions.  It also provides support for integrating with Google Analytics, Mixpanel, and other third-party tools.  For more details, see the [Tealium for engineers](https://code.uberinternal.com/w/tealium/) documentation.

This plugin adds Tealium iQ's `utag.js` to your web application and exposes a programmatic API for tracking, identifying, and logging pageviews.  For more details on `utag.js`, see the [`JavaScript (utag.js)`](https://community.tealiumiq.com/t5/JavaScript-utag-js/tkb-p/utag) documentation.

------

### Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Setup](#setup)
- [API](#api)
  - [Registration API](#registration-api)
    - [`TealiumPlugin`](#tealiumplugin)
    - [`TealiumToken`](#tealiumtoken)
  - [Dependencies](#dependencies)
    - [`TealiumConfigToken`](#tealiumconfigtoken)
  - [Service API](#service-api)

------

### Installation

```sh
yarn add @uber/fusion-plugin-tealium-react
```

------

### Usage

```js
import React from 'react';
import {withTealium} from 'fusion-plugin-tealium-react';

const SignupButton = ({tealium}) => {
  // see https://docs.google.com/document/d/19uu4PFoofhryLQNQhJkG9-ClwqgPUl8m_MCTCiIgLi8
  const trackingData = {
    eventName: 'web.awesome-service.signup',
    eventType: 'start'
  };
  return <button onClick={() => tealium.track(trackingData)}>Signup Here</button>;
};

export default withTealium(SignupButton);
```

------

### Setup

```js
// src/main.js
import App from 'fusion-react';
import TealiumPlugin, {
    TealiumToken,
    TealiumConfigToken
} from '@uber/fusion-plugin-tealium-react';

export default () => {
  const app = new App();
  // ...
  app.register(TealiumToken, TealiumPlugin);
  if (__NODE__) {
    // ...
    app.register(TealiumConfigToken, {/*some config*/});
    // ...
  }
  // ...
  return app;
}
```

------

### API

#### Registration API

##### `TealiumPlugin`

```js
import TealiumPlugin from '@uber/fusion-plugin-tealium-react';
```

The Tealium plugin. Typically, it should be registered to [`TealiumToken`](#TealiumToken). Provides the [Tealium service](#service-api).

##### `TealiumToken`

```js
import {TealiumToken} from '@uber/fusion-plugin-tealium-react';
```

The canonical token for the Tealium plugin. Typically, it should be registered with the [`Tealium`](#TealiumPlugin) plugin.

#### Dependencies

##### `TealiumConfigToken`

```js
import {TealiumConfigToken} from '@uber/fusion-plugin-tealium-react';
```

Required.  Server only.  Configuration for the Tealium plugin.  For more details on configuration, see the [Tealium for engineers](https://code.uberinternal.com/w/tealium/) documentation.

###### Types

```js
type GeoType = 'NL' | 'FR' | 'IN' /*| etc...*/;
type TealiumConfig = {
  account: string,
  profile: string,
  geo: GeoType,
  env: string
}
```

###### Example

An example configuration can be found [here](https://code.uberinternal.com/D645395).

------

#### Service API

The browser exports a programmatic API which exposes the following functions.

```js
Tealium.identify(id: string)
```

- `id: string` - Required.  Sets the current user ID to attach to `track` requests.

```js
Tealium.track(data: ?Object);
```

- `data: ?Object` - Optional.  Contains the attributes associated with this specific tracking call.

`track` is used to collect information about user interactions within a page.  Generally these are events that occur after page load, like button clicks or expanding sections.  See the [Event Tracking](https://community.tealiumiq.com/t5/JavaScript-utag-js/Event-Tracking/ta-p/15588) documentation for more details on event tracking.

```js
Tealium.pageview({
  title: ?string,
  page: ?string,
  data: ?Object
});
```

- `title: ?string` - Optional.  If no title is provided, this will default to the page title defined by `@uber/fusion-analyticsjs-utils`'s [`getPageData`](https://code.uberinternal.com/diffusion/WEFUSPF/browse/master/src/utilities/page-data.js$15).
- `page: ?string` - Optional.  Path name of the current page.  If no page is provided, this will default to the path name defined by `@uber/fusion-analyticsjs-utils`'s [`getPageData`](https://code.uberinternal.com/diffusion/WEFUSPF/browse/master/src/utilities/page-data.js$13).
- `data: ?Object` - Optional.  Contains the attributes associated with this specific tracking call.  Key-value pairs are ultimately provided to Tealium iQ as [utag_data](https://community.tealiumiq.com/t5/JavaScript-utag-js/How-utag-data-works/ta-p/15369).

`pageview` is used to gather information on users' navigation paths through your web application.  Generally this is used when page content is loaded or changed.  See the [Page Tracking](https://community.tealiumiq.com/t5/JavaScript-utag-js/Page-Tracking/ta-p/15563) documentation for more details on tracking page views.
