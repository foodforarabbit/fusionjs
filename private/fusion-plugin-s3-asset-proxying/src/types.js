// @flow
import {S3ConfigToken, AssetProxyingResponseHeaderOverrides} from './tokens.js';

import type {LRU} from 'lru-cache';

export type S3ConfigType = {
  bucket: string,
  prefix: string,
  accessKeyId: string,
  secretAccessKey: string,
  endpoint: ?string,
  s3ForcePathStyle: ?boolean,
};

export type S3AssetProxyDepsType = {
  s3Config: typeof S3ConfigToken.optional,
  customViewerResponseHeaders: typeof AssetProxyingResponseHeaderOverrides.optional,
};

export type S3AssetProxyType = {
  notFoundCache: LRU,
  config: S3ConfigType,
  s3: any, // can't get actual type out of aws SDK due to treeshaking issues
};
