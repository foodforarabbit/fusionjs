// @flow
import type FusionApp from 'fusion-core';
import HealthPlugin from './health';

export default function initUserPlugins(app: FusionApp) {
  app.middleware(HealthPlugin);
  return app;
}
