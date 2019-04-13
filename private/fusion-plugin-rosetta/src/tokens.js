// @flow
import {createToken} from 'fusion-core';
import type {
  RosettaClientType,
  RosettaConfigType,
  RosettaLocaleNegotiationType,
} from './types';

export const ClientToken = createToken<RosettaClientType>('RosettaClient');
export const ConfigToken = createToken<RosettaConfigType>('RosettaConfig');
export const LocaleNegotiationToken = createToken<RosettaLocaleNegotiationType>(
  'RosettaLocaleNegotiation'
);
