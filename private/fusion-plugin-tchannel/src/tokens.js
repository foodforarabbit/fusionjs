// @flow

import {createToken, type Token} from 'fusion-core';
import type {TChannelType} from './types.js';

export const TChannelClientToken: Token<any> = createToken('TChannelClient');
export const TChannelToken: Token<TChannelType> = createToken('TChannelToken');
