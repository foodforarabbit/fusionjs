// @flow
import App from 'fusion-core';
import AnalyticsSession, {
  AnalyticsSessionToken,
  AnalyticsCookieTypeToken,
  UberWebEventCookie,
} from '../../index.js';

export default async function start(options: any = {}) {
  const app = new App('flow test', el => el);
  app.register(AnalyticsSessionToken, AnalyticsSession);
  app.register(AnalyticsCookieTypeToken, UberWebEventCookie);

  return app;
}
