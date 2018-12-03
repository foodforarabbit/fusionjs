// @flow
import {createToken} from 'fusion-core';
import type {S3ConfigType} from './types.js';

export const S3ConfigToken = createToken<S3ConfigType>('S3Config');
export const AssetProxyingResponseHeaderOverrides = createToken<Object>(
  'ResponseConfig'
);
