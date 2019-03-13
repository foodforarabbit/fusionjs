// @flow
import {createToken} from 'fusion-core';

import type {Token} from 'fusion-core';
import type {HeatpipePluginServiceType} from './types';

const HeatpipeToken: Token<HeatpipePluginServiceType> = createToken(
  'HeatpipeToken'
);

export {HeatpipeToken};
