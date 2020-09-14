// @flow

import type {Context, FusionPlugin} from 'fusion-core';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {UberMarketingToken} from '@uber/fusion-plugin-marketing';

import {
  FeatureTogglesTogglesConfigToken,
  FeatureTogglesClientToken,
  FeatureTogglesClientConfigToken,
} from './tokens.js';

export type FeatureToggleConfigType = {
  +name: string,
  +exposeToClient?: boolean,
};

export type FeatureTogglesDepsType = {
  +toggleConfigs: typeof FeatureTogglesTogglesConfigToken,
  +Client: typeof FeatureTogglesClientToken.optional,
  +clientConfig: typeof FeatureTogglesClientConfigToken.optional,
  +atreyu: typeof AtreyuToken.optional,
  +marketing: typeof UberMarketingToken.optional,
};

export type ToggleDetailsType = {|
  +enabled: boolean,
  +metadata?: {+[string]: any},
|};

export type ClientConfigType = {+[string]: any};

export interface IFeatureTogglesClient {
  constructor(
    ctx: Context,
    toggleConfig: Array<string>,
    deps: any,
    config: ClientConfigType,
    ...rest?: any
  ): IFeatureTogglesClient;
  +load: () => Promise<void>;
  +get: (toggleName: string) => ToggleDetailsType;
}

export type FeatureTogglesServiceType = {|
  +from: (ctx?: Context) => IFeatureTogglesClient,
|};

export type FeatureTogglesPluginType = FusionPlugin<
  FeatureTogglesDepsType,
  FeatureTogglesServiceType
>;
