// @flow

import {AnalyticsCookieTypeToken} from './tokens';
import type {Context} from 'fusion-core';

import type {CookiesSetOptions} from 'koa';

export type PluginServiceType = {
  refreshCookie?: CookieTypeType => void,
  refreshCookies?: void => void,
  get: (cookieType?: CookieTypeType) => Object,
  set: (cookieType: CookieTypeType, data: any) => void,
};

export type PluginType = {
  from: (ctx: Context) => Object,
  _from: (ctx: Context) => PluginServiceType,
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
  data: {[string]: Symbol | string} | Symbol,
  rolling?: boolean,
};
