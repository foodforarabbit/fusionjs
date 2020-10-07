// @flow
/* eslint-env browser */
import server from './server';
import browser from './browser';

declare var __NODE__: Boolean;

export {default as mock} from './mock';

export default __NODE__ ? server : browser;
export {
  M3Token,
  M3ClientToken,
  CommonTagsToken,
  HistogramOptionsToken,
} from './tokens.js';
export type {
  ServiceType as M3Type,
  TagsType as M3TagsType,
  M3DepsType,
} from './types.js';
