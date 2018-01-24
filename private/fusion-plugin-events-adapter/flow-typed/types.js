// @flow
declare class EventEmitter {
  on(event: string, handler: (Object) => void): void;
  emit(event: string, payload: any): void;
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

export type I18nPlugin = {
  from: (
    ctx: Object
  ) => {
    locale: {
      toString: () => string,
    },
  },
};
