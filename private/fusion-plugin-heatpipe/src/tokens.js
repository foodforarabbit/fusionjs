// @flow
import {createToken} from 'fusion-core';

import type {Token} from 'fusion-core';
import type {HeatpipePluginServiceType, HeatpipeConfigType} from './types';

import HeatpipePublisher from '@uber/node-heatpipe-publisher';

const HeatpipeToken: Token<HeatpipePluginServiceType> = createToken(
  'HeatpipeToken'
);
const HeatpipeClientToken: Token<Class<HeatpipePublisher>> = createToken(
  'HeatpipeClientToken'
);
const HeatpipeConfigToken: Token<HeatpipeConfigType> = createToken(
  'HeatpipeConfigToken'
);

export {HeatpipeToken, HeatpipeClientToken, HeatpipeConfigToken};
