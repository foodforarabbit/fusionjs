// @flow

import {createToken} from 'fusion-core';

import type {Token} from 'fusion-core';
import type {
  M3Type,
  ServiceType,
  TagsType,
  M3HistogramOptions,
} from './types.js';

export const M3Token: Token<ServiceType> = createToken('M3');
export const M3ClientToken: Token<M3Type> = createToken('M3Client');

export const CommonTagsToken: Token<TagsType> = createToken('commonTags');
export const HistogramOptionsToken: Token<M3HistogramOptions> = createToken(
  'histogramOptions'
);
