// @flow
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

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
  level: string,
  message: string,
  meta: PayloadMetaType,
};
