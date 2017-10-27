/* eslint-env browser */
import {Plugin} from '@uber/graphene-plugin';

export default function EventsAdapterFactory({UniversalEvents}) {
  if (!UniversalEvents) {
    throw new Error('{UniversalEvents} dependency is required');
  }
  const events = UniversalEvents.of();
  if (!events) {
    throw new Error('{UniversalEvents.of()} must return an instance of UniversalEvents');
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

  return class NoopPlugin extends Plugin {};
}
