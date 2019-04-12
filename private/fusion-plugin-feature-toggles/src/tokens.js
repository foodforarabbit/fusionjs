// @flow

import {createToken} from 'fusion-core';
import type {Token} from 'fusion-core';

import type {
  FeatureToggleConfigType,
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

export const FeatureTogglesTogglesConfigToken: Token<
  Array<FeatureToggleConfigType | string>
> = createToken('FeatureTogglesTogglesConfigToken');

export const FeatureTogglesToken: Token<FeatureTogglesServiceType> = createToken(
  'FeatureTogglesToken'
);
