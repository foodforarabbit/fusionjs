// @flow

import type {I18nServiceType} from 'fusion-plugin-i18n';

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

export type GeolocationData = {
  latitude: number,
  longitude: number,
};

export type GeolocationPlugin = {
  from: (
    ctx: Object
  ) => {
    lookup: () => GeolocationData,
  },
};

export type {I18nServiceType};
