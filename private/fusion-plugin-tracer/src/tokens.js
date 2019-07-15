// @flow

import {createToken} from 'fusion-core';
import type {Token} from 'fusion-core';

import type {TracerServiceType, Tracer} from './types.js';

export const TracerToken: Token<TracerServiceType> = createToken('Tracer');

type MockConfig = {|
  mock: boolean,
  sampler: any,
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
