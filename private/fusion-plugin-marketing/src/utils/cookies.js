// @flow
import uuidV4 from 'uuid/v4';
import isUUID from 'validator/lib/isUUID';

import type {PluginConfig} from '../types';
import type {Context} from 'fusion-core';
import type {CookiesSetOptions} from 'koa';

export function setCookieId(
  ctx: Context,
  cookieId: string,
  {cookieDomain, cookieIdKey, cookieAge}: PluginConfig
) {
  const options: $Shape<CookiesSetOptions> = {
    expires: new Date(Date.now() + cookieAge * 1000),
    httpOnly: false,
  };
  if (cookieDomain) {
    options.domain = cookieDomain;
  }

  ctx.cookies.set(cookieIdKey, cookieId, options);
}

export function getCookieId(ctx: Context, key: string): string {
  const cookieId = ctx.cookies.get(key) || '';

  // Check if our current cookie UUID is valid and try to reuse it.
  if (isValidUUID(cookieId, 4)) {
    return cookieId;
  }

  // If invalid or missing, generate a new UUID.
  return uuidV4();
}

export function isValidUUID(...args: any) {
  try {
    return isUUID(...args);
  } catch (e) {
    return false;
  }
}
