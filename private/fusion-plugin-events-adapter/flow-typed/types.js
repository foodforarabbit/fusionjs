// @flow
declare class EventEmitter {
  on(event: string, handler: (Object) => void): void;
  emit(event: string, payload: any): void;
}

export type UniversalEvents = {
  of: (ctx?: Object) => EventEmitter,
};

export type SessionData = {
  session_id: ?string,
  session_time_ms: ?number,
};

export type AnalyticsSessionPlugin = {
  of: (ctx: Object) => ?SessionData,
};

export type GeolocationData = {
  latitude: number,
  longitude: number,
};

export type GeolocationPlugin = {
  of: (
    ctx: Object
  ) => {
    lookup: () => GeolocationData,
  },
};

export type I18nPlugin = {
  of: (
    ctx: Object
  ) => {
    locale: {
      toString: () => string,
    },
  },
};
