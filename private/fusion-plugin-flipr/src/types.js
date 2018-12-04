// @flow

import type {FusionPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';

import {FliprClientToken, FliprConfigToken} from './tokens.js';

export type {FliprConfigType, FliprClientType} from './tokens.js';

export type FliprDepsType = {
  config: typeof FliprConfigToken.optional,
  logger: typeof LoggerToken,
  Client: typeof FliprClientToken.optional,
};
export type FliprServiceType = {
  startUpdating?: (errCallback: (err: Error) => void) => void,
  destroy?: () => any,
  [string]: Function, // remaining methods from provided FliprClient
};
export type FliprPluginType = FusionPlugin<FliprDepsType, FliprServiceType>;
