// @flow

import type {I18nServiceType} from 'fusion-plugin-i18n';
import type {Context} from 'fusion-core';

import {RouteTagsToken} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {AnalyticsSessionToken} from '@uber/fusion-plugin-analytics-session';
import {I18nToken} from 'fusion-plugin-i18n';
import {AuthHeadersToken} from '@uber/fusion-plugin-auth-headers';

import {M3Token} from '@uber/fusion-plugin-m3';
import {LoggerToken} from 'fusion-tokens';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';

export interface EventEmitter {
  on(event: string, handler: (Object) => any): any;
  emit(event: string, payload: any): any;
}

export type UniversalEvents = {
  from: (ctx?: Object) => EventEmitter,
};

export type SessionData = {
  session_id: ?string,
  session_time_ms: ?number,
};

export type AnalyticsSessionPlugin = {
  from: (ctx: Object) => ?SessionData,
};

export type EventsAdapterDepsType = {
  events: typeof UniversalEventsToken,
  AnalyticsSession: typeof AnalyticsSessionToken,
  AuthHeaders: typeof AuthHeadersToken.optional,
  I18n: typeof I18nToken.optional,
  m3: typeof M3Token,
  heatpipe: typeof HeatpipeToken,
  logger: typeof LoggerToken,
  RouteTags: typeof RouteTagsToken,
};
export type EventsAdapterType = {
  logTiming: (string, {[string]: mixed}) => number => void,
};

export type EventsAdapterAnalyticsType = {
  from: Context => {
    pageview: any => void,
  },
};

export type {I18nServiceType};
