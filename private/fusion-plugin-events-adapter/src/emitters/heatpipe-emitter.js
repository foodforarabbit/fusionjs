// @flow
import type {
  AnalyticsSessionPlugin,
  GeolocationPlugin,
  I18nServiceType,
} from '../types';

import {AuthHeadersToken} from '@uber/fusion-plugin-auth-headers';

type ExtractReturnType = <V>(() => V) => V;
type AuthHeadersService = $Call<typeof AuthHeadersToken, ExtractReturnType>;

export const webTopicInfo = {
  topic: 'hp-event-web',
  version: 8,
};

type HeatpipeArgs = {
  // TODO: HeatpipeEmitter Plugin typing
  heatpipe: any,
  AnalyticsSession: AnalyticsSessionPlugin,
  AuthHeaders?: AuthHeadersService,
  Geolocation?: GeolocationPlugin,
  I18n?: I18nServiceType,
  serviceName: string,
};

type WebEventsMeta = {
  page: {
    url: string,
    hostname: string,
    pathname: string,
    referrer: string,
  },
  dimensions: {
    screen_width: number,
    screen_height: number,
    viewport_width: number,
    viewport_height: number,
  },
};

export default function({
  heatpipe,
  AnalyticsSession,
  AuthHeaders,
  Geolocation,
  I18n,
  serviceName,
}: HeatpipeArgs) {
  const HeatpipeEmitter: HeatpipeEmitter = {
    publish: (payload: {topicInfo: Object, message: Object}) => {
      heatpipe.publish(payload.topicInfo, payload.message);
    },
    publishWebEvents: (payload: {
      message: Object,
      ctx?: Object,
      webEventsMeta?: WebEventsMeta,
    }) => {
      heatpipe.publish(webTopicInfo, {
        ...payload.message,
        ...getWebEventsMetaFields(payload.webEventsMeta),
        ...getContextFields(payload.ctx),
      });
    },
  };

  function getWebEventsMetaFields(webEventsMeta) {
    if (webEventsMeta) {
      return {
        page: webEventsMeta.page,
        dimensions: webEventsMeta.dimensions,
      };
    }
    return {};
  }

  function getContextFields(ctx) {
    if (ctx) {
      // TODO: Should we do more validation here? heatpipe will do validation
      // against the schema, but it can be difficult to surface that to the user
      const userAgent = ctx.useragent || {
        browser: {},
        engine: {},
        os: {},
        ua: undefined,
      };
      // TODO: Should we add more information here about the device/cpu archictecture?
      const uaInfo =
        (userAgent && {
          name: userAgent.browser.name,
          version: userAgent.browser.version,
          engine: userAgent.engine.name,
          os: userAgent.os.name,
          os_version: userAgent.os.version,
          user_agent: userAgent.ua,
        }) ||
        {};
      const {session_id = 'unknown', session_time_ms = 0} =
        AnalyticsSession.from(ctx) || {};
      const geolocation = (Geolocation && Geolocation.from(ctx).lookup()) || {};

      const locale = I18n && I18n.from(ctx).locale;

      return {
        browser: {
          ...uaInfo,
          locale: (locale && locale.toString()) || '',
        },
        app_name: serviceName,
        user_id:
          (AuthHeaders && AuthHeaders.from(ctx).get('uuid')) || 'unknown',
        session_id,
        session_time_ms,
        time_ms: Date.now(),
        ...geolocation,
      };
    }
    return {};
  }

  return HeatpipeEmitter;
}
