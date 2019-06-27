// @flow
import FliprPlugin, {FliprConfigToken} from '@uber/fusion-plugin-flipr';
import UberWebAnalytics, {
  UberWebAnalyticsToken,
  UberWebAnalyticsFliprToken,
  UberWebAnalyticsFliprConfigToken,
  UberWebAnalyticsFliprConfig,
} from '@uber/fusion-plugin-web-analytics';

export default function initAnalytics(app: FusionApp) {
  if (__NODE__) {
    // node specific plugins
    app
      .register(UberWebAnalyticsFliprToken, FliprPlugin)
      .alias(FliprConfigToken, UberWebAnalyticsFliprConfigToken);

    app.register(UberWebAnalyticsFliprConfigToken, UberWebAnalyticsFliprConfig);
  }
  app.register(UberWebAnalyticsToken, UberWebAnalytics);
}
