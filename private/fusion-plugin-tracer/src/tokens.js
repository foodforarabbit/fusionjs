// @flow

import {createToken} from 'fusion-core';
import type {Token} from 'fusion-core';

import type {Tracer} from './types.js';

export const TracerToken: Token<Tracer> = createToken('Tracer');

type MockConfig = {|
  mock: boolean,
|};
type TracerConfig = $Shape<{
  ...MockConfig,
  ...{|
    serviceName?: string,
  |},
}>;
export const TracerConfigToken: Token<TracerConfig> = createToken(
  'TracerConfig'
);

type TracerOptions = {
  logger?: any,
  reporter?: any,
};
export const TracerOptionsToken: Token<TracerOptions> = createToken(
  'TracerOptions'
);

type InitTracer = (
  config: $Rest<TracerConfig, MockConfig>,
  options: TracerOptions
) => Tracer;
export const InitTracerToken: Token<InitTracer> = createToken(
  'InitTracerToken'
);
