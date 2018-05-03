// @flow

import type FusionApp from 'fusion-core';

import FaviconPlugin from './plugins/favicon.js';
import CssResetPlugin from './plugins/css-reset.js';
import FullHeightPlugin from './plugins/full-height.js';
import HealthPlugin from './plugins/health.js';

export default (app: FusionApp) => {
  if (__NODE__) {
    // node-specific plugins
    app.middleware(FaviconPlugin);
    app.middleware(CssResetPlugin);
    app.middleware(FullHeightPlugin);
    app.middleware(HealthPlugin);
  } else {
    // browser-specific plugins
  }

  // universal plugins
};
