// @flow

import {createToken} from 'fusion-core';
import type {PluginServiceType} from './types.js';

export const Token = createToken<PluginServiceType>('MyPlugin');
