// @flow
import {createToken} from 'fusion-core';
import type {
  RosettaClientType,
  RosettaConfigType,
  RosettaLocaleNegotiationType,
  RosettaGetTranslationsType
} from './types';

export const ClientToken = createToken<RosettaClientType>('RosettaClient');
export const ConfigToken = createToken<RosettaConfigType>('RosettaConfig');
export const LocaleNegotiationToken = createToken<RosettaLocaleNegotiationType>(
  'RosettaLocaleNegotiation'
);

export const GetTranslationsToken = createToken<RosettaGetTranslationsType>(
  'GetTranslations'
);