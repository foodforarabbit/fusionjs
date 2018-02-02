# @uber/fusion-plugin-events-adapter

An adapter for uber specific events to their logging destinations.

## Overview

At Uber, we log several useful metrics/stats to M3 or Heapipe/Kafka for monitoring and further analysis.
Plugins such as [fusion-plugin-browser-performance-emitter](https://github.com/fusionjs/fusion-plugin-browser-performance-emitter) produces the data and emits via [Universal Events](https://github.com/fusionjs/fusion-plugin-universal-events).
`EventsAdapter` implements the consumption of these different events in one place, in other words, logging these data to multiple destinations such as M3 and Heatpipe/Kafka.


## Installation

```
yarn-add @uber/fusion-plugin-events-adapter
```

## Dependencies
+ [Universal Events](https://github.com/fusionjs/fusion-plugin-universal-events) for listening to universal events
+ [Analytics Session Plugin](https://code.uberinternal.com/diffusion/WEFUSYW/) for generating and accessing visitor browser session cookie
+ [I18n Plugin](https://github.com/fusionjs/fusion-plugin-i18n) to determine the resolved user locale

`// TODO: Geolocation`

## Usage
`// TODO: verify README usage`

```js
// main.js
import App from 'fusion-react';
import {
  FetchToken,
  LoggerToken,
  SessionToken,
  createToken
} from 'fusion-tokens';

import SecretsPlugin, {
  DevSecretsToken,
  SecretsToken,
} from '@uber/fusion-plugin-secrets';

import JWTSessionfrom, {
  SessionSecretToken
  SessionCookieNameToken
} from 'fusion-plugin-jwt';

import CsrfProtectionPlugin from 'fusion-plugin-csrf-protection-react';
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';

import M3Plugin, {M3Token} from 'fusion-plugin-m3';
import FusionLogger, {LogtronBackendsToken, LogtronTeamToken} from '@uber/fusion-plugin-logtron';
import HeatpipePlugin, {HeatpipeToken, HeatpipeConfigToken} from '@uber/fusion-plugin-heatpipe';

import {I18n, I18nLoaderToken} from 'fusion-plugin-i18n-react';
import FusionRosetta from '@uber/fusion-plugin-rosetta';

import GoogleAnalyticsPlugin, {
  GoogleAnalyticsConfigToken, 
  GoogleAnalyticsToken
} from '@uber/fusion-plugin-google-analytics';
// or if you have an external website
// import TealiumPlugin from '@uber/fusion-plugin-tealium';

import AnalyticsSessionPlugin, {UberWebEventCookie, AnalyticsCookieTypeToken, AnalyticsSessionToken} from 'fusion-plugin-analytics-session';

import EventsAdapterPlugin, {
  EventsAdapterToken,
} from '@uber/fusion-plugin-events-adapter';

import root from './components/root';

// ...importing configs

const teamName = 'awesome-team';

const BaseFetchToken = createToken('BaseFetch');

export default async function start() {
  const app = new App(root);
  
  app.register(SecretsToken, SecretsPlugin);
  __DEV__ && app.register(DevSecretsToken, {dev: 'values'});

  app.register(SessionToken, JWTSession);
  app.register(SessionSecretToken, 'some-secret');
  app.register(SessionCookieNameToken, 'some-cookie-name');

  app.register(FetchToken, CsrfProtection).alias(FetchToken, BaseFetchToken);
  __BROWSER__ && app.register(BaseFetchToken, window.fetch);

  app.register(UniversalEventsToken, UniversalEvents).alias(FetchToken, BaseFetchToken);

  app.register(M3Token, M3Plugin);
  app.register(LoggerToken, FusionLogger);
  app.register(LogtronTeamToken, teamName);
  app.register(HeatpipeToken, HeatpipePlugin);
  app.register(HeatpipeConfigToken, heatpipeConfig);

  app.register(I18nToken, I18n);
  app.register(I18nLoaderToken, FusionRosetta);  

  app.register(GoogleAnalyticsToken, GoogleAnalyticsPlugin);
  app.register(GoogleAnalyticsConfigToken, {
    trackingId: 'your-tracking-id',
  };

  app.register(AnalyticsSessionToken, AnalyticsSessionPlugin);
  app.register(AnalyticsCookieTypeToken, UberWebEventCookie);

  app.register(EventsAdapterToken, EventsAdapterPlugin)
      .alias(EventsAdapterAnalyticsToken, GoogleAnalyticsToken);
  
  return app;
}
```

