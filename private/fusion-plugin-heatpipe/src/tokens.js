// @flow
import {createToken} from 'fusion-core';

import type {Token} from 'fusion-core';
import type {
  HeatpipePluginServiceType,
  HeatpipeClientType,
  HeatpipeConfigType,
} from './types';

const HeatpipeToken: Token<HeatpipePluginServiceType> = createToken(
  'HeatpipeToken'
);
const HeatpipeClientToken: Token<HeatpipeClientType> = createToken(
  'HeatpipeClientToken'
);
const HeatpipeConfigToken: Token<HeatpipeConfigType> = createToken(
  'HeatpipeConfigToken'
);

export {HeatpipeToken, HeatpipeClientToken, HeatpipeConfigToken};
