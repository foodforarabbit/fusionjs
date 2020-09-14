// @flow

import type {Context} from 'fusion-core';
import type {MarketingPluginServiceType} from '@uber/fusion-plugin-marketing';

/**
 * Generates a mock for '@uber/fusion-plugin-marketing' that matches the exported
 * type MarketingPluginServiceType.
 *
 * An object containing top level overrides for any of the properties/methods
 * may be provided.  For example:
 *
 * const mock = mockFactory({
 *   getCookieId: () => 'some-overridden-cookie-id'
 * });
 */
const mockFactory = (overrides?: {
  [string]: mixed,
}): MarketingPluginServiceType => ({
  from: (ctx: Context) => {
    const mock = {
      ctx: (({}: any): Context),
      config: {
        cookieAge: 0,
        cookieIdKey: '',
        cookieDomain: null,
        serverDomain: '',
        disableHeatpipe: false,
        debugLogging: false,
      },
      getAnalyticsSessionId: (ctx?: Context) => '',
      getCookieId: () => 'default_cookie',
      setCookieId: () => undefined,
      shouldSkipTracking: () => true,
      publish: async () => undefined,
      handleClientTrackRequest: () => ({
        cookie_id: '',
        session_id: '',
      }),
      setTrackingInfo: (ctx?: Context) => undefined,
      track: (ctx?: Context) => undefined,
      ...(overrides || {}),
    };
    return mock;
  },
});

export default mockFactory;
