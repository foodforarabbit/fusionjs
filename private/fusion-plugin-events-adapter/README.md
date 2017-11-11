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
[Universal Events](https://github.com/fusionjs/fusion-plugin-universal-events) for listening to universal events
[Analytics Session Plugin](https://code.uberinternal.com/diffusion/WEFUSYW/) for generating and accessing visitor browser session cookie
[I18n Plugin](https://github.com/fusionjs/fusion-plugin-i18n) for knowing the user locale

`// TODO: Geolocation`

## Usage
```js// main.js
import App from 'fusion-react';
import root from './components/root';

import SecretsPlugin from '@uber/fusion-plugin-secrets';
import JWTSessionPlugin from 'fusion-plugin-jwt';
import CsrfProtectionPlugin from 'fusion-plugin-csrf-protection-react';
import UniversalEventsPlugin from 'fusion-plugin-universal-events-react';

import M3Plugin from '@uber/fusion-plugin-m3';
import LoggerPlugin from '@uber/fusion-plugin-logtron';
import HeatpipePlugin from '@uber/fusion-plugin-heatpipe';

import RosettaPlugin from '@uber/fusion-plugin-rosetta';
import I18nPlugin from 'fusion-plugin-i18n-react';

import AnalyticsSessionPlugin, {
  UberWebEventCookie,
} from '@uber/fusion-plugin-analytics-session';

import EventsAdapterPlugin from '@uber/events-adapter';

// ...importing configs

const team = 'awesome-team';
const service = 'awesome-frontend';

export default async function start() {
  const app = new App(root);
  const Secrets = app.plugin(SecretsPlugin, secretsConfig);
  const Session = app.plugin(JWTSessionPlugin, getSessionConfig({Secrets}));
  const CsrfProtection = app.plugin(CsrfProtectionPlugin, {
    Session,
    fetch: unfetch,
  });
  const {fetch, ignore} = CsrfProtection.of();
  const UniversalEvents = app.plugin(UniversalEvents, {fetch});
  const M3 = app.plugin(M3Plugin, {UniversalEvents, service});
  const Logger = app.plugin(LoggerPlugin, {UniversalEvents, M3, team, service});
  app.plugin(HeatpipePlugin, {
    M3,
    Logger,
    UniversalEvents,
    heatpipeConfig,
  });
  
  const Rosetta = app.plugin(RosettaPlugin, __NODE__ && {service, Logger});
  const I18n = app.plugin(
    I18nPlugin,
    __NODE__ ? {TranslationsLoader: Rosetta} : {fetch}
  );

  const AnalyticsSession = app.plugin(AnalyticsSessionPlugin, {
    cookieType: UberWebEventCookie,
  });

  app.plugin(EventsAdapterPlugin, {
    UniversalEvents,
    AnalyticsSession,
    I18n,
    config: {service}
  });
  
  return app;
}
```

