// @flow

import type {Context, FusionPlugin} from 'fusion-core';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';

import {
  FeatureTogglesToggleNamesToken,
  FeatureTogglesClientToken,
  FeatureTogglesClientConfigToken,
} from './tokens.js';

export type FeatureTogglesDepsType = {
  +toggleNames: typeof FeatureTogglesToggleNamesToken,
  +Client: typeof FeatureTogglesClientToken.optional,
  +clientConfig: typeof FeatureTogglesClientConfigToken.optional,
  +atreyu: typeof AtreyuToken.optional,
};

export type ToggleDetailsType = {|
  +enabled: boolean,
  +metadata?: {+[string]: any},
|};

export type ClientConfigType = {+[string]: any};

export interface IFeatureTogglesClient {
  constructor(
    ctx: Context,
    toggleNames: Array<string>,
    deps: any,
    config: ClientConfigType,
    ...rest?: any
  ): IFeatureTogglesClient;
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
