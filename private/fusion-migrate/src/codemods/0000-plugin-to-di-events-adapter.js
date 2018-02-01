const compose = require('../utils/compose');
const add = require('../utils/add-package');
const bump = require('../utils/bump-version');

module.exports = compose(
  bump('@uber/fusion-plugin-events-adapter', '0.4.2'),
  add('@uber/fusion-plugin-analytics-session', '0.2.0'),
  ({source}) =>
    source.replace(
      `import EventsAdapterPlugin from '@uber/fusion-plugin-events-adapter';`,
      `import EventsAdapter from '@uber/fusion-plugin-events-adapter';
import AnalyticsSession, {
  UberWebEventCookie,
  AnalyticsCookieTypeToken,
  AnalyticsSessionToken
} from '@uber/fusion-plugin-analytics-session';`
    ),
  ({source}) =>
    source.replace(
      `app.plugin(EventsAdapterPlugin, {UniversalEvents, config: {service}});`,
      `app.register(EventsAdapter);
  app.register(AnalyticsSessionToken, AnalyticsSession);
  app.register(AnalyticsCookieTypeToken, UberWebEventCookie);`
    )
);
