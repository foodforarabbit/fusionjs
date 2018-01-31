const compose = require('../utils/compose');
const bump = require('../utils/bump-version');
const migrate = require('../utils/plugin-to-di-standalone');

module.exports = compose(
  bump('@uber/fusion-plugin-events-adapter', '0.4.1'),
  ({source}) =>
    source.replace(
      `import EventsAdapterPlugin from '@uber/fusion-plugin-events-adapter';`,
      `import EventsAdapter, {
  EventsAdapterToken
} from '@uber/fusion-plugin-events-adapter';
import AnalyticsSessionPlugin, {
  UberWebEventCookie,
  AnalyticsCookieTypeToken,
  AnalyticsSessionToken
} from '@uber/fusion-plugin-analytics-session';`
    ),
  ({source}) =>
    source.replace(
      `app.plugin(EventsAdapterPlugin, {UniversalEvents, config: {service}});`,
      `app.register(EventsAdapterToken, EventsAdapter);
  app.register(AnalyticsSessionToken, AnalyticsSessionPlugin);
  app.register(AnalyticsCookieTypeToken, UberWebEventCookie);`
    )
);
