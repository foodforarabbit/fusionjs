// @flow

import type {FusionPlugin, Context} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';

import {
  TracerConfigToken,
  TracerOptionsToken,
  InitTracerToken,
} from './tokens.js';

export type Tracer = any;

type TracerDepsType = {
  logger: typeof LoggerToken,
  config: typeof TracerConfigToken.optional,
  options: typeof TracerOptionsToken.optional,
  initClient: typeof InitTracerToken.optional,
};
type TracerServiceType = {
  tracer: Tracer,
  from: (
    ctx: Context
  ) => {
    span: any,
    tracer: Tracer,
  },
};
export type TracerPluginType = FusionPlugin<TracerDepsType, TracerServiceType>;
