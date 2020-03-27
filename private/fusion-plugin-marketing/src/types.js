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
    getCookieId: () => string,
  },
};

export type PluginCanActivate = {
  canActivate: boolean,
};
