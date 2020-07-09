// @flow
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import type {M3Type} from '@uber/fusion-plugin-m3';
import type {Logger} from 'winston';

type ExtractReturnType = <V>(() => V) => V;

export type IEmitter = $Call<ExtractReturnType, typeof UniversalEventsToken>;

export type PayloadMetaType = {
  message?: string | {},
  col?: number,
  source?: string,
  line?: number,
  error?:
    | Error
    | {
        stack?: string,
        // TODO: message should just be string but Flow...  ¯\_(ツ)_/¯
        message?: any,
        source?: string,
        line?: number,
      },
  stack?: string,
  tags?: {ua?: {}},
};

export type PayloadType = {
  callback?: Function,
  level: string,
  message: string,
  meta: PayloadMetaType,
};

export type LevelMapType = {[string]: {levelName: string, level: number}};

export type SentryConfigType = {id: string};

export type ErrorLogOptionsType = {
  transformError: PayloadMetaType => PayloadMetaType,
  payload: PayloadType,
  envMeta: {
    runtimeEnvironment: ?string,
    isProduction?: boolean,
    deploymentName: ?string,
    gitSha: ?string,
    appID: ?string,
  },
  sentryLogger: ?Logger<{[string]: number}>,
  m3?: M3Type,
  team?: string,
};

export type LoggerConfigType = {minimumLogLevel: string};
export type EnvOverrideType = {uberRuntime?: string, node?: string};
