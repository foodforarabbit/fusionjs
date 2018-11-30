// @flow
import {createToken} from 'fusion-core';
import type {TealiumType, TealiumConfigType} from './types.js';

export const TealiumToken = createToken<TealiumType>('TealiumToken');
export const TealiumConfigToken = createToken<TealiumConfigType>(
  'TealiumConfigToken'
);
