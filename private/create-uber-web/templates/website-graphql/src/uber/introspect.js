// @noflow
import type FusionApp from 'fusion-core';
import introspect from 'fusion-plugin-introspect';
import metricsStore from '@uber/fusion-metrics';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';

export default function initIntrospect(app: FusionApp) {
  app.register(
    introspect(app, {
      deps: {
        heatpipe: HeatpipeToken,
      },
      store: metricsStore(),
    })
  );
}
