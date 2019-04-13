// @flow
/* eslint-env browser */
import {createToken} from 'fusion-core';

import type {
  InitializeServerType,
  BedrockCompatPluginServiceType,
} from './types';

export const InitializeServerToken = createToken<InitializeServerType>(
  'InitializeServer'
);
export const BedrockCompatToken = createToken<BedrockCompatPluginServiceType>(
  'BedrockCompat'
);
