// @flow
import {setupGoogleAnalytics} from './google-analytics/server';
import {setupTealium} from './tealium/server';

import type {Context} from 'fusion-core';
import type {DestinationConfig} from '../types';

export const destinationSetups = {
  googleAnalytics: setupGoogleAnalytics,
  tealium: setupTealium,
  m3: null,
  'web-heatpipe': null,
};

export function setupDestinations({
  ctx,
  destinationsConfig,
}: {
  ctx: Context,
  destinationsConfig: {[destinationName: string]: DestinationConfig},
}) {
  let hasGA = false;
  Object.values(destinationsConfig).forEach((destConfig: any) => {
    if (destConfig.type === 'googleAnalytics') {
      if (!hasGA) {
        hasGA = true;
        setupGoogleAnalytics({ctx});
      }
    } else {
      const setup = destinationSetups[destConfig.type];
      if (setup) {
        setup({ctx, config: destConfig.config || {}});
      }
    }
  });
}
