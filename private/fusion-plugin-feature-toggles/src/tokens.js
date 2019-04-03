// @flow

import {createToken} from 'fusion-core';
import type {Token} from 'fusion-core';

import type {
  IFeatureTogglesClient,
  FeatureTogglesServiceType,
  ClientConfigType,
} from './types.js';

export const FeatureTogglesClientToken: Token<
  Class<IFeatureTogglesClient>
> = createToken('FeatureTogglesClientToken');

export const FeatureTogglesClientConfigToken: Token<ClientConfigType> = createToken(
  'FeatureTogglesClientConfigToken'
);

export const FeatureTogglesToggleNamesToken: Token<Array<string>> = createToken(
  'FeatureTogglesToggleNamesToken'
);

export const FeatureTogglesToken: Token<FeatureTogglesServiceType> = createToken(
  'FeatureTogglesToken'
);
