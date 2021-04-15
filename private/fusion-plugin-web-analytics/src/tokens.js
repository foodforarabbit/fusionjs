// @flow
import {createToken} from 'fusion-core';
import {FliprToken} from '@uber/fusion-plugin-flipr';

import type {Token} from 'fusion-core';
import type {WebAnalyticsPluginServiceType} from './types';

export const UberWebAnalyticsToken: Token<WebAnalyticsPluginServiceType> = createToken(
  'UberWebAnalyticsToken'
);
// TODO: support analyticsState
export const UberWebAnalyticsStateToken: Token<any> = createToken(
  'UberWebAnalyticsStateToken'
);
export const UberWebAnalyticsFliprToken: typeof FliprToken = createToken(
  'UberWebAnalyticsFliprToken'
);
export const UberWebAnalyticsFliprConfigToken: Token<Object> = createToken(
  'UberWebAnalyticsFliprConfigToken'
);
