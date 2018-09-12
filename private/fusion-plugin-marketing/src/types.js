// @flow

import type {Context} from 'fusion-core';

export type PluginConfig = {
  cookieAge: number,
  cookieIdKey: string,
  cookieDomain: string,
  serverDomain: string,
  disableHeatpipe: boolean,
};

export type PluginServiceType = {
  from: (
    ctx: Context
  ) => {
    ctx: Context,
  },
};
