/* eslint-env browser */
import {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import pageViewBrowser from './handlers/page-view-browser';

import {EventsAdapterAnalyticsToken} from './tokens';

export default __BROWSER__ &&
  createPlugin({
    deps: {
      UniversalEvents: UniversalEventsToken,
      Analytics: EventsAdapterAnalyticsToken,
    },
    provides({UniversalEvents, Analytics}) {
      const events = UniversalEvents.from();
      if (!events) {
        throw new Error(
          'UniversalEvents.from() must return an instance of UniversalEvents'
        );
      }

      function webEventsMetaMapper(payload) {
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
      }

      events.map('pageview:browser', webEventsMetaMapper);
      events.map('redux:action', webEventsMetaMapper);
      events.map('browser-performance-emitter:stats', webEventsMetaMapper);

      pageViewBrowser({
        events,
        analytics: Analytics && Analytics.from(),
      });

      return {
        from() {
          throw new Error('No available service for EventsAdapter in browser');
        },
      };
    },
  });
