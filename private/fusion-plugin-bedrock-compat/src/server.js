// @noflow
/* eslint-env node */
import {createPlugin, createToken} from 'fusion-core';
import bedrock from '@uber/bedrock-14-compat';
import {LoggerToken} from 'fusion-tokens';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {M3Token} from '@uber/fusion-plugin-m3';
import {GalileoToken} from '@uber/fusion-plugin-galileo';
import {FliprToken} from '@uber/fusion-plugin-flipr';
import zeroConfig from 'zero-config';

export const InitializeServerToken = createToken('InitializeServer');
export const BedrockCompatToken = createToken('BedrockCompat');

export default __NODE__ &&
  createPlugin({
    deps: {
      initServer: InitializeServerToken.optional,
      logger: LoggerToken,
      atreyu: AtreyuToken,
      m3: M3Token,
      galileo: GalileoToken.optional,
      flipr: FliprToken.optional,
    },
    provides: deps => {
      const server = bedrock.createServer();
      server.config = zeroConfig(process.cwd(), {
        defaults: {}, // TODO: Bedrock defaults here?
        seed: {},
        dcValue: process.env.UBER_DATACENTER || 'sjc1',
      }).get();
      server.logger = deps.logger;
      server.m3 = deps.m3;
      server.clients = {
        logger: deps.logger,
        atreyu: deps.atreyu,
        m3: deps.m3,
        galileo: deps.galileo ? deps.galileo.galileo : {},
        flipr: deps.flipr,
      };

      if (__DEV__) {
        var mockHeaders = server.config.mockHeaders || {};
        server.app.use(function mockNginxHeaders(req, res, next) {
          Object.keys(mockHeaders).forEach(function each(headerName) {
            req.headers[headerName] =
              req.headers[headerName] || mockHeaders[headerName];
          });
          return next();
        });
      }
      server.app.use((req, res, next) => {
        res.putState('bedrock', {
          appName: process.env.SVC_ID,
          assets: {},
          auth: {
            uuid:
              req.headers['x-auth-params-uuid'] ||
              req.headers['x-auth-params-user-uuid'],
            email: req.headers['x-auth-params-email'],
            groups: req.headers['x-auth-params-groups'] || [],
            roles: req.headers['x-auth-params-roles'] || [],
          },
        });
        return next();
      });
      return deps.initServer ? deps.initServer(server, () => {}) : server;
    },
  });
