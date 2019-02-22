// @flow
import {createToken} from 'fusion-core';
import type {PluginConfig, PluginServiceType} from './types';

export const UberMarketingToken = createToken<PluginServiceType>(
  'UberMarketingToken'
);
export const UberMarketingConfigToken = createToken<PluginConfig>(
  'UberMarketingConfigToken'
);
