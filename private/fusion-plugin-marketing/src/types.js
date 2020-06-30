// @flow

import type {Context} from 'fusion-core';

export type PluginConfig = {
  cookieAge: number,
  cookieIdKey: string,
  cookieDomain: string | null,
  serverDomain: string,
  disableHeatpipe: boolean,
  debugLogging: boolean,
};

export type PluginServiceType = {
  from: (
    ctx: Context
  ) => {
    ctx: Context,
    config: PluginConfig,
    getAnalyticsSessionId: (ctx?: Context) => string,
    getCookieId: () => string,
    setCookieId: () => void,
    shouldSkipTracking: () => boolean,
    publish: () => Promise<void>,
    handleClientTrackRequest: () => TrackResponse,
    setTrackingInfo: (ctx?: Context) => void,
    track: (ctx?: Context) => void,
  },
};

export type TrackResponse = {
  cookie_id: string,
  session_id: string,
};

export type BrowserPluginServiceType = {
  from: (
    ctx: Context
  ) => {
    getTrackResponse: () => ?TrackResponse,
    track: () => void,
  },
};

export type PluginCanActivate = {
  canActivate: boolean,
};
