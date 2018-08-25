/* eslint-env node */
import path from 'path';
import {createPlugin} from 'fusion-core';
import LRU from 'lru-cache';
import {S3ConfigToken, AssetProxyingResponseHeaderOverrides} from './tokens';

const defaultViewerResponseHeaders = {
  'cache-control': 'public, max-age=31536000',
  'timing-allow-origin': '*',
};

export default __NODE__ &&
  createPlugin({
    deps: {
      s3Config: S3ConfigToken.optional,
      customViewerResponseHeaders:
        AssetProxyingResponseHeaderOverrides.optional,
    },
    provides: ({s3Config}) => {
      const aws = require('aws-sdk');
      const loadConfig = require('../s3-config');
      s3Config = s3Config || loadConfig();
      class S3Service {
        constructor() {
          this.notFoundCache = new LRU({
            // store 404s
            max: 500,
          });
          this.config = s3Config;
          const {
            accessKeyId,
            secretAccessKey,
            s3ForcePathStyle,
            endpoint,
          } = this.config;
          this.s3 = new aws.S3({
            accessKeyId,
            secretAccessKey,
            s3ForcePathStyle,
            endpoint,
          });
        }
      }
      return new S3Service();
    },
    middleware: (deps, state) => {
      return async function middleware(ctx, next) {
        if (
          ctx.method !== 'HEAD' &&
          ctx.method !== 'GET' &&
          ctx.status !== 404
        ) {
          return next();
        }

        const customViewerResponseHeaders =
          deps.customViewerResponseHeaders || {};

        // Only proxy URLs starting with /_static
        if (!ctx.path || !ctx.path.startsWith('/_static/')) {
          return next();
        }

        const reqPath = ctx.path.substring(9);
        const notFoundCache = state.notFoundCache;
        if (notFoundCache.get(reqPath)) {
          // If we know that a previous request to this asset has responded with a 404
          // we can safely assume that it will not be available in S3 until the next
          // service deploy.
          return next();
        }

        const s3 = state.s3;
        const {bucket, prefix} = state.config;

        const {
          s3Error,
          statusCode,
          headers: s3ResponseHeaders,
          data,
        } = await new Promise(resolve =>
          s3.getObject(
            {
              Bucket: bucket,
              Key: path.join(prefix, reqPath),
            },
            function(s3Error, data) {
              let statusCode =
                this.httpResponse && this.httpResponse.statusCode;
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
          const responseHeaders = {
            ...s3ResponseHeaders,
            ...defaultViewerResponseHeaders,
            ...customViewerResponseHeaders,
          };
          Object.keys(responseHeaders).forEach(h =>
            ctx.set(h, responseHeaders[h])
          );
          ctx.status = statusCode;
          ctx.body = data.Body;
        }
        return next();
      };
    },
  });
