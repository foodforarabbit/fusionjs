// @flow

import {AnalyticsCookieTypeToken} from './tokens';
import type {Context} from 'fusion-core';

import type {CookiesSetOptions} from 'koa';

export type ServerPluginServiceType = {
  setCookie: CookieTypeType => void,
  setCookies: void => void,
  get: (cookieType?: CookieTypeType) => Object,
};

export type ServerPluginType = {
  from: (ctx: Context) => Object,
  _from: (ctx: Context) => ServerPluginServiceType,
};

export type BrowserPluginServiceType = {
  get: (cookieType?: CookieTypeType) => Object,
};

export type BrowserPluginType = {
  from: (ctx: Context) => Object,
  _from: (ctx: Context) => BrowserPluginServiceType,
};

export type DepsType = {
  pluginCookieType: typeof AnalyticsCookieTypeToken,
};

export type CookieModuleType = {
  get: (key: string) => ?Object,
};

export type CookieTypeType = {
  name: string,
  options?: $Shape<CookiesSetOptions>,
  data?: {
    session_id?: Symbol | string,
    session_time_ms?: Symbol | string,
  },
  rolling?: boolean,
};
