// @flow
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import type {Logger} from 'winston';

type ExtractReturnType = <V>(() => V) => V;

export type IEmitter = $Call<ExtractReturnType, typeof UniversalEventsToken>;

export type PayloadMetaType = {
  message?: string | {},
  col?: number,
  source?: string,
  line?: string,
  error?: {
    stack: string,
    message: string,
  },
  stack?: string,
};

export type PayloadType = {
  callback?: Function,
  level: string,
  message: string,
  meta: PayloadMetaType,
};

export type LevelMapType = {
  error: string,
  warn: string,
  info: string,
  debug: string,
  silly: string,
  verbose: string,
  trace: string,
  access: string,
  fatal: string,
};

export type SentryConfigType = {id: string};

export type ErrorLogOptionsType = {
  transformError: PayloadMetaType => PayloadMetaType,
  payload: PayloadType,
  env: ?string,
  sentryLogger: ?Logger<{[string]: number}>,
  team?: string,
};
