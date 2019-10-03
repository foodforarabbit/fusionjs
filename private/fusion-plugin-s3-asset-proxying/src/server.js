/* @flow */
/* eslint-env node */
import path from 'path';
import {createPlugin} from 'fusion-core';
import LRU from 'lru-cache';
import type {FusionPlugin} from 'fusion-core';
import {S3ConfigToken, AssetProxyingResponseHeaderOverrides} from './tokens.js';
import type {
  S3AssetProxyDepsType,
  S3AssetProxyType,
  S3ConfigType,
} from './types.js';

const defaultViewerResponseHeaders = {
  'cache-control': 'public, max-age=31536000',
  'timing-allow-origin': '*',
};

export default ((__NODE__ &&
  createPlugin<S3AssetProxyDepsType, S3AssetProxyType>({
    deps: {
      s3Config: S3ConfigToken.optional,
      customViewerResponseHeaders:
        AssetProxyingResponseHeaderOverrides.optional,
    },
    provides: deps => {
      const aws = require('aws-sdk');
      const loadConfig = require('../s3-config');
      const s3Config = deps.s3Config || loadConfig();
      class S3Service {
        notFoundCache: LRU;
        config: S3ConfigType;
        s3: aws.S3;

        constructor() {
          this.notFoundCache = new LRU({
            // store 404s
            max: 500,
          });
          this.config = s3Config;
          let {
            bucket,
            accessKeyId,
            secretAccessKey,
            endpoint,
            s3ForcePathStyle,
          } = this.config;
          let httpOptions = undefined;

          // If a custom endpoint is set up, then we don't want to proxy via TerraBlob.
          // This is used for tests where a specific endpoint is set up.
          if (!endpoint) {
            const svc =
              process.env.SVC_ID || process.env.npm_package_name || 'unknown';
            const TB_PORT = 18839;
            const tpathEnv = 'prod';
            this.config.prefix = path.join(
              tpathEnv,
              'web-platform',
              'fusion-upload-assets',
              svc
            );
            bucket = 'terrablob';
            accessKeyId = svc;
            secretAccessKey = svc;
            endpoint = undefined;
            s3ForcePathStyle = false;
            httpOptions = {proxy: `http://localhost:${TB_PORT}`};
          }

          this.s3 = new aws.S3({
            params: {Bucket: bucket},
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
            endpoint,
            s3ForcePathStyle,
            customUserAgent: 'fusion-plugin-s3-asset-proxying/0.0.0',
            httpOptions,
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
        const {prefix} = state.config;

        const {
          s3Error,
          statusCode,
          headers: s3ResponseHeaders,
          data,
        } = await new Promise(resolve =>
          s3.getObject({Key: path.join(prefix, reqPath)}, function(
            s3Error,
            data
          ) {
            const statusCode =
              this.httpResponse && this.httpResponse.statusCode;
            const headers = this.httpResponse && this.httpResponse.headers;
            return resolve({s3Error, statusCode, headers, data});
          })
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
  }): any): FusionPlugin<S3AssetProxyDepsType, S3AssetProxyType>);
