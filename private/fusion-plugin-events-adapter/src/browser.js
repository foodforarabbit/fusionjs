// @flow
/* eslint-env browser */
import {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import type {FusionPlugin} from 'fusion-core';

import pageViewBrowser from './handlers/page-view-browser';

import {EventsAdapterAnalyticsToken} from './tokens';

export const webEventsMetaMapper = (payload: *) => {
  const location = window.location || {};

  return {
    ...payload,
    webEventsMeta: {
      dimensions: {
        viewport_height: window.innerHeight,
        viewport_width: window.innerWidth,
        screen_height: window.screen ? window.screen.height : null,
        screen_width: window.screen ? window.screen.width : null,
      },
      // TODO: this should probably come from react router, because the router
      // knows the matched path/trackingId
      page: {
        hostname: location.hostname,
        pathname: location.pathname,
        referrer: document.referrer,
        url: location.href,
      },
      time_ms: Date.now(),
    },
  };
};

const plugin =
  __BROWSER__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
      Analytics: EventsAdapterAnalyticsToken.optional,
    },
    middleware({events, Analytics}) {
      return (ctx, next) => {
        const ctxEvents = events.from(ctx);
        ctxEvents.map('*', webEventsMetaMapper);
        pageViewBrowser({
          events,
          analytics: Analytics && Analytics.from(ctx),
        });
        return next();
      };
    },
    provides: () => {
      return {
        from() {
          throw new Error('No available service for EventsAdapter in browser');
        },
      };
    },
  });

export default ((plugin: any): FusionPlugin<*, *>);