// @flow
import type FusionApp from 'fusion-core';
import HealthPlugin from './health';

export default function initUserPlugins(app: FusionApp) {
  if (__NODE__) {
    app.middleware(HealthPlugin);
  }
  return app;
}
