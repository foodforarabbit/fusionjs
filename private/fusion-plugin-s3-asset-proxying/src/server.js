/* eslint-env node */
import path from 'path';
import {Plugin} from '@uber/graphene-plugin';
import LRU from 'lru-cache';

export default ({config} = {}) => {
  return class extends Plugin {
    constructor() {
      super();
      this.notFoundCache = new LRU({
        // store 404s
        max: 500,
      });
    }
    static of() {
      // Singleton only, we don't care about scoping for ctx (similarly, we wouldn't want/need to init per request)
      return super.of();
    }

    async init() {
      // Require this inline because rollup is busted
      this.config = config || (await require('../s3-config.js')());
      const {
        accessKeyId,
        secretAccessKey,
        s3ForcePathStyle,
        endpoint,
      } = this.config;
      // Require this inline because rollup is busted
      this.s3 = new (require('aws-sdk')).S3({
        accessKeyId,
        secretAccessKey,
        s3ForcePathStyle,
        endpoint,
      });
    }

    static async middleware(ctx, next) {
      const state = this.of();
      if (!state.config || !state.s3) {
        throw new Error('You must init asset proxying middleware before using');
      }

      if (ctx.method !== 'HEAD' && ctx.method !== 'GET' && ctx.status !== 404) {
        return next();
      }

      const reqPath = ctx.path;
      const notFoundCache = state.notFoundCache;
      if (notFoundCache.get(reqPath)) {
        // If we know that a previous request to this asset has responded with a 404
        // we can safely assume that it will not be available in S3 until the next
        // service deploy.
        return next();
      }

      const s3 = state.s3;
      const {bucket, prefix} = state.config;

      const {s3Error, statusCode, headers, data} = await new Promise(resolve =>
        s3.getObject(
          {
            Bucket: bucket,
            Key: path.join(prefix, reqPath),
          },
          function(s3Error, data) {
            let statusCode = this.httpResponse && this.httpResponse.statusCode;
            const headers = this.httpResponse && this.httpResponse.headers;
            return resolve({s3Error, statusCode, headers, data});
          }
        )
      );

      if (s3Error || statusCode !== 200) {
        // Cache 404 responses. If these assets are requested by a browser
        // and are not currently in S3, there is no way they can appear
        // there unless a project is redeployed. We can safely cache
        // the 404 responses from S3 in memory, and direct the static asset
        // server to proceed to the application router instead.
        // S3 sometimes returns 403 instead of 404
        if (statusCode === 404 || statusCode === 403) {
          notFoundCache.set(reqPath, true);
        }
      } else {
        Object.keys(headers).forEach(h => ctx.set(h, headers[h]));
        ctx.status = statusCode;
        ctx.body = data.Body;
      }

      return next();
    }
  };
};
