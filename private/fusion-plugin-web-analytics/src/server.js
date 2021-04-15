/* eslint-env node */
// @flow

import {html, createPlugin} from 'fusion-core';
import type {Context} from 'fusion-core';

import {EventContext} from './event-context';
import {setupDestinations} from './destinations/server';
import {UberWebAnalyticsFliprToken} from './tokens';

import type {WebAnalyticsPluginType} from './types.js';

const noopConfig = {
  destinations: {},
  events: {},
  schemes: {},
  errors: [],
};

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      flipr: UberWebAnalyticsFliprToken,
    },
    provides() {
      const eventContext = new EventContext({});
      return {
        createDestinations: () => {
          throw new Error('[Web Analytics] No server service.');
        },
        track: () => {
          throw new Error('[Web Analytics] No server service.');
        },
        eventContext,
      };
    },
    middleware({flipr}) {
      return async (ctx: Context, next) => {
        if (!ctx.element) {
          return next();
        }

        const serviceName = process.env.SVC_ID || 'development';

        let analyticsConfig;
        try {
          analyticsConfig = flipr.get(`${serviceName}.0`) || noopConfig;
        } catch (e) {
          // TODO improve Flipr error handling
          analyticsConfig = noopConfig;
        }

        const serialized = JSON.stringify(analyticsConfig);
        const script = html`
          <script type="application/json" id="__ANALYTICS_CONFIG__">
            ${serialized}
          </script>
        `;
        ctx.template.body.push(script);

        setupDestinations({
          ctx,
          destinationsConfig: analyticsConfig.destinations,
        });

        await next();
      };
    },
  });

export default ((plugin: any): WebAnalyticsPluginType);
