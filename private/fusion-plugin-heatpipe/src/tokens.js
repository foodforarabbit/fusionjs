// @flow
import {createToken} from 'fusion-core';

import type {Token} from 'fusion-core';
import type {HeatpipePluginServiceType, HeatpipeConfigType} from './types';

const HeatpipeToken: Token<HeatpipePluginServiceType> = createToken(
  'HeatpipeToken'
);

const HeatpipeConfigToken: Token<HeatpipeConfigType> = createToken(
  'HeatpipeConfigToken'
);

export {HeatpipeToken, HeatpipeConfigToken};
