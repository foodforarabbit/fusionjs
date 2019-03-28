// @flow

import type {Context, FusionPlugin} from 'fusion-core';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';

import {
  FeatureTogglesClientToken,
  FeatureTogglesToggleNamesToken,
} from './tokens.js';

export type FeatureTogglesDepsType = {
  toggleNames: typeof FeatureTogglesToggleNamesToken,
  Client: typeof FeatureTogglesClientToken.optional,
  atreyu: typeof AtreyuToken.optional,
};

export type ToggleDetailsType = {|
  +enabled: boolean,
  +metadata?: {[string]: any},
|};

export interface IFeatureTogglesClient {
  constructor(...params?: any): IFeatureTogglesClient;
  +load: () => Promise<void>;
  +get: (toggleName: string) => Promise<ToggleDetailsType>;
}

export type FeatureTogglesServiceType = {|
  +from: (ctx?: Context) => IFeatureTogglesClient,
|};

export type FeatureTogglesPluginType = FusionPlugin<
  FeatureTogglesDepsType,
  FeatureTogglesServiceType
>;
