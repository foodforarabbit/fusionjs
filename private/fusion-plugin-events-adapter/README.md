# @uber/fusion-plugin-events-adapter

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Pipes [universal events](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events) to Uber monitoring infrastructure.

At Uber, we log several useful metrics/stats to M3 or Heapipe/Kafka for monitoring and further analysis.
Plugins such as [fusion-plugin-browser-performance-emitter](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-browser-performance-emitter) produces the data and emits via [Universal Events](https://github.com/fusionjs/fusionjs/tree/master/fusion-plugin-universal-events). The `EventsAdapter` plugin creates the event listeners that handle dispatching of data from those plugins to their appropriate destinations (i.e. M3 and Heatpipe/Kafka).

Many Fusion.js plugins emit data to the universal events bus, for example `fusion-plugin-react-router` and `fusion-plugin-i18n-react`.

---

### Table of contents

* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [API](#api)
  * [Registration API](#registration-api)
    * [`EventsAdapter`](#eventsadapter)
    * [`EventsAdapterToken`](#eventsadaptertoken)
  * [Dependencies](#dependencies)
    * [`AnalyticsSessionToken`](#analyticssessiontoken)
    * [`M3Token`](#m3token)
    * [`HeatpipeToken`](#heatpipetoken)
    * [`LoggerToken`](#loggertoken)

---

### Installation

```
yarn add @uber/fusion-plugin-events-adapter
```

---

### Usage

This plugin is pre-configured in the `uber-web` scaffold. Its service isn't meant to be used programmatically by application developers.

#### URL Parameters in Routes

When using URL parameters in `react-router` the route names generated include characters that are invalid for M3 (specifically `:`). All invalid characters in the route will be replaced with `__`.

---

### Setup

```js
import App from 'fusion-react';
import React from 'react';
import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events';
import EventsAdapter, {
  EventsAdapterToken,
} from '@uber/fusion-plugin-events-adapter';
import AnalyticsSession, {
  UberWebEventCookie,
  AnalyticsCookieTypeToken,
  AnalyticsSessionToken,
} from '@uber/fusion-plugin-analytics-session';
import M3, {M3Token} from '@uber/fusion-plugin-m3';
import Heatpipe, {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
import {LoggerToken} from 'fusion-tokens';
import Logger from '@uber/fusion-plugin-logtron';

export default async function start() {
  const app = new App(<div>hello</div>);
  app.register(EventsAdapterToken, EventsAdapter);
  app.register(UniversalEventsToken, UniversalEvents);
  app.register(AnalyticsSessionToken, AnalyticsSession);
  app.register(AnalyticsCookieTypeToken, UberWebEventCookie);
  app.register(M3Token, M3);
  app.register(HeatpipeToken, Heatpipe);
  app.register(LoggerToken, Logger);
  return app;
}
```

---

### API

#### Registration API

##### `EventsAdapter`

```js
import EventsAdapter from '@uber/fusion-plugin-events-adapter';
```

The plugin. Should be registered to [`EventsAdapterToken`](#eventsadaptertoken).

##### `EventsAdapterToken`

```js
import {EventsAdapterToken} from '@uber/fusion-plugin-events-adapter';
```

Should be registered with [`EventsAdapter`](#eventsadapter)

##### `EventsAdapterMiddlewareTimingAllowListToken`

```js
import {EventsAdapterMiddlewareTimingAllowListToken} from '@uber/fusion-plugin-events-adapter';
```

Optional. The value registered is an array of URLs that will allow for measuring middleware timing.
See the RFC [here](https://github.com/uber/fusionjs/blob/master/public/rfcs/text/0000-middleware-timing.md).

#### Dependencies

##### `AnalyticsSessionToken`

```js
import {AnalyticsSessionToken} from '@uber/fusion-plugin-analytics-session';
```

Gets cookies for analytics events. Typically, it should be registered with [`AnalyticsSession`](https://code.uberinternal.com/diffusion/WEFUSYW/#analyticssession) from `@uber/fusion-plugin-analytics-session`.

##### `M3Token`

```js
import {M3Token} from '@uber/fusion-plugin-m3';
```

Sink for metrics. Typically should be registered with `M3` from [`@uber/fusion-plugin-m3`](https://code.uberinternal.com/diffusion/WEFUSHE/#m3)

##### `HeatpipeToken`

```js
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
```

Sink for Kafka logging. Typically, should be registered with `Heatpipe` from [`@uber/fusion-plugin-heatpipe`](https://code.uberinternal.com/diffusion/WEFUSVQ/)

##### `LoggerToken`

```js
import {LoggerToken} from 'fusion-tokens';
```

Typically should be registered with `@uber/fusion-plugin-logtron`
