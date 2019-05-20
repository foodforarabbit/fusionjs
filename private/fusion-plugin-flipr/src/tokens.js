// @flow

import {createToken} from 'fusion-core';
import type {Token} from 'fusion-core';
import type {Logger} from 'fusion-tokens';

import type {FliprServiceType} from './types.js';

type OverridesType = {[string]: mixed};
export type FliprConfigType = {|
  // Plugin config properties
  +defaultNamespace?: ?string,
  +dataCenter?: string,
  +overrides?: OverridesType,
  // @uber/flipr-client config properties
  +propertiesNamespaces?: Array<string>,
  +updateInterval?: number,
  +defaultProperties?: Object,
  +diskCachePath?: ?string,
|};

type FliprClientOptionsType = {
  +propertiesNamespaces?: Array<string>,
  +logger: Logger,
  +dcPath: ?string,
  +propertiesNamespaces: $PropertyType<FliprConfigType, 'propertiesNamespaces'>,
  +updateInterval: $PropertyType<FliprConfigType, 'updateInterval'>,
  +defaultProperties: $PropertyType<FliprConfigType, 'defaultProperties'>,
  +diskCachePath: $PropertyType<FliprConfigType, 'diskCachePath'>,
};
export type FliprClientType = (
  options: FliprClientOptionsType
) => {
  startUpdating?: (err: mixed) => void,
  +[string]: mixed,
};

export const FliprToken: Token<FliprServiceType> = createToken('FliprToken');

export const FliprClientToken: Token<FliprClientType> = createToken(
  'FliprClientToken'
);
export const FliprConfigToken: Token<FliprConfigType> = createToken(
  'FliprConfigToken'
);
