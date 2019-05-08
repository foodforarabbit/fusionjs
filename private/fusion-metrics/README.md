# @uber/fusion-metrics

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

Metrics tracking for Fusion apps

This library is meant to be used as the production data sink for fusion-plugin-introspect data. It sends runtime data to heatpipe.

## Usage

```
import App from 'fusion-react';
import HeatpipePlugin, {
  HeatpipeToken,
  HeatpipeConfigToken
} from '@uber/fusion-plugin-heatpipe';
import UniversalEvents, {UniversalEventsToken} from 'fusion-plugin-universal-events';

import introspect from 'fusion-plugin-introspect';
import store from '@uber/fusion-metrics';

export default async () => {
  const app = new App(root);
  app.register(HeatpipeToken, HeatpipePlugin);
  app.register(UniversalEventsToken, UniversalEvents);

  app.register(
    introspect({
      deps: {heatpipe: HeatpipeToken},
      store: store(),
    })
  )

  return app;
}
```

Data is collected on application start (for server data) and upon first request (for browser data).

Runtime data is sent to these heatpipe topic:

- https://watchtower.uberinternal.com/datasets/hp-unified-logging-fusion-runtime-metadata/2/overview
  - service name
  - node version
  - npm version
  - yarn version
  - lock file type
  - server instance uuid (unique id per server start)
  - git ref
- https://watchtower.uberinternal.com/datasets/hp-unified-logging-fusion-runtime-dependency-version-usage/2/overview
  - service name
  - dependency name
  - version (as specified package.json)
  - server instance uuid (unique id per server start)
  - git ref
