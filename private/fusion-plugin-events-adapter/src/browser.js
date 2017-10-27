/* eslint-env browser */
import {Plugin} from '@uber/graphene-plugin';

export default function EventsAdapterFactory({UniversalEvents}) {
  if (!UniversalEvents) {
    throw new Error('{UniversalEvents} dependency is required');
  }
  const events = UniversalEvents.of();

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

  return new Plugin();
}
