// @flow
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {M3Token} from '@uber/fusion-plugin-m3';
import {BackendsToken, TeamToken, TransformsToken} from './tokens.js';

type ExtractReturnType = <V>(() => V) => V;

export type IEmitter = $Call<ExtractReturnType, typeof UniversalEventsToken>;

export type PayloadMetaType = {
  message?: string,
  col?: number,
  source?: string,
  line?: string,
  error?: {
    stack: string | Array<mixed>,
    message?: string,
  },
};

export type PayloadType = {
  callback?: Function,
  level: string,
  message: string,
  meta: PayloadMetaType,
};

export type LogtronDepsType = {
  events: typeof UniversalEventsToken,
  m3: typeof M3Token,
  backends: typeof BackendsToken.optional,
  team: typeof TeamToken,
  transforms: typeof TransformsToken.optional,
};
