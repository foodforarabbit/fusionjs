// @flow
import {createToken} from 'fusion-core';
import type {PluginConfig, PluginServiceType, PluginCanActivate} from './types';

export const UberMarketingToken = createToken<PluginServiceType>(
  'UberMarketingToken'
);
export const UberMarketingConfigToken = createToken<PluginConfig>(
  'UberMarketingConfigToken'
);

export const UberMarketingCanActivateToken = createToken<PluginCanActivate>(
  'UberMarketingCanActivateToken'
);
