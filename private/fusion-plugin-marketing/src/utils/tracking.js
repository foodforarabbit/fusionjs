// @flow
import isBot from 'isbot';
import requestIp from 'request-ip';

import {QUERY_KEYS} from '../constants';

import type {PluginConfig} from '../types';
import type {Context} from 'fusion-core';

export function createTrackingPayload(
  ctx: Context,
  cookieId: string,
  {serverDomain}: PluginConfig
) {
  // Add in the url parameters
  const queryParamsPicked = QUERY_KEYS.reduce((out, key) => {
    if (ctx.query[key]) {
      if (Array.isArray(ctx.query[key])) {
        out[key] = ctx.query[key][0];
      } else {
        out[key] = ctx.query[key];
      }
    }

    return out;
  }, {});

  return {
    ...queryParamsPicked,
    timestamp: new Date().valueOf() / 1000,
    url: `https://${serverDomain}${ctx.path}`,
    original_url: `https://${serverDomain}${ctx.originalUrl}`,
    ip: requestIp.getClientIp(ctx),
    cookie_id: cookieId,
    status_code: ctx.status,
    prefetched:
      ctx.headers['x-moz'] === 'prefetch' ||
      ctx.headers['x-purpose'] === 'preview',
    referrer: ctx.headers['referer'] || '',
    user_agent: getUserAgentInfo(ctx),
  };
}

export function getUserAgentInfo(ctx: Context) {
  const rawUA = ctx.headers['user-agent'];
  const parsedUA = ctx.useragent;

  return {
    string: rawUA,
    browser_family: parsedUA.browser.name,
    browser_version: parsedUA.browser.version,
    os_family: parsedUA.os.name,
    os_version: parsedUA.os.version,
    is_bot: isBot(rawUA),
    is_mobile: Boolean(parsedUA.device.type),
  };
}

export function shouldSkipTracking(ctx: Context, trackingInfo: any) {
  const {path} = ctx;
  return (
    trackingInfo.user_agent.is_bot ||
    // spec routes
    path.startsWith('/robots.txt') ||
    // Uber routes
    path.endsWith('/health') ||
    // Bedrock apps
    path.includes('/csrf-token') ||
    path.startsWith('/rtapi') ||
    path.includes('/static/') ||
    // Fusion.js apps
    path.startsWith('/api') ||
    path.startsWith('/_events') ||
    path.startsWith('/_static') ||
    // file extensions
    path.endsWith('.js') ||
    path.endsWith('.css') ||
    path.endsWith('.ico') ||
    path.endsWith('.jpg') ||
    path.endsWith('.png') ||
    // others
    (path.endsWith('/apple-app-site-association') &&
      trackingInfo.status_code === 404)
  );
}
