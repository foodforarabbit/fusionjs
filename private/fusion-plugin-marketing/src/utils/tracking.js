// @flow
import isBot from 'isbot';
import requestIp from 'request-ip';

import {QUERY_KEYS, OPTIMIZELY_COOKIE_KEY} from '../constants';

import type {PluginConfig} from '../types';
import type {Context} from 'fusion-core';

export function createTrackingPayload(
  ctx: Context,
  payload: Object,
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
    status_code: ctx.status,
    prefetched:
      ctx.headers['x-moz'] === 'prefetch' ||
      ctx.headers['x-purpose'] === 'preview',
    referrer: ctx.headers.referer || '',
    user_agent: getUserAgentInfo(ctx),
    optimizely_cookie: getOptimizelyCookieInfo(ctx),
    ...payload,
  };
}

function getUserAgentInfo(ctx: Context) {
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

function getOptimizelyCookieInfo(ctx: Context) {
  let optimizely_array = (ctx.cookies.get(OPTIMIZELY_COOKIE_KEY) || '').split(
    '_'
  );
  if (!optimizely_array || optimizely_array.length !== 4) {
    optimizely_array = [null, null, null, null];
  }

  return {
    project_id: optimizely_array[0],
    campaign_id: optimizely_array[1],
    experiment_id: optimizely_array[2],
    variation_id: optimizely_array[3],
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
    path.includes('/assets/') ||
    // Fusion.js apps
    path.startsWith('/api') ||
    path.startsWith('/_events') ||
    path.startsWith('/_static') ||
    path.startsWith('/_translations') ||
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
