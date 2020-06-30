// @flow
import {createToken} from 'fusion-core';
import type {
  PluginConfig,
  PluginServiceType,
  PluginCanActivate,
  BrowserPluginServiceType,
} from './types';

export const UberMarketingToken = createToken<PluginServiceType>(
  'UberMarketingToken'
);
export const UberMarketingBrowserToken = createToken<BrowserPluginServiceType>(
  'UberMarketingBrowserToken'
);
export const UberMarketingConfigToken = createToken<PluginConfig>(
  'UberMarketingConfigToken'
);

export const UberMarketingCanActivateToken = createToken<PluginCanActivate>(
  'UberMarketingCanActivateToken'
);
