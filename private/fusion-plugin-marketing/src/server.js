// @flow

import {createPlugin, memoize} from 'fusion-core';
import stringify from 'fast-safe-stringify';
import parseDomain from 'parse-domain';
import type {FusionPlugin, Context} from 'fusion-core';
import type {PluginServiceType, PluginConfig} from './types.js';

import {LoggerToken} from 'fusion-tokens';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';

import {TRACK_TOPIC} from './constants';

import {getCookieId, setCookieId} from './utils/cookies';
import {createTrackingPayload, shouldSkipTracking} from './utils/tracking';

import {
  UberMarketingConfigToken,
  UberMarketingCanActivateToken,
} from './tokens';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      userConfig: UberMarketingConfigToken.optional,
      canActivate: UberMarketingCanActivateToken.optional,
      heatpipe: HeatpipeToken,
      logger: LoggerToken,
    },
    provides({userConfig = {}}) {
      class MarketingPlugin {
        ctx: Context;
        config: PluginConfig;
        visitorUuid: string;

        constructor(ctx) {
          this.ctx = ctx;

          const reqHostname = ctx.hostname || 'UNKNOWN';
          const parsedHostname = parseDomain(reqHostname) || {};
          const {domain, tld} = parsedHostname;
          const rootDomain = domain && tld ? `.${domain}.${tld}` : null;

          this.config = {
            cookieAge: 31536000,
            cookieIdKey: 'marketing_vistor_id', // intentional typo
            cookieDomain: rootDomain,
            serverDomain: reqHostname,
            disableHeatpipe: false,
            debugLogging: false,
            ...userConfig,
          };

          this.visitorUuid = getCookieId(ctx, this.config.cookieIdKey);
        }

        getCookieId() {
          return this.visitorUuid;
        }
      }
      return {
        from: memoize(ctx => new MarketingPlugin(ctx)),
      };
    },
    middleware(
      {userConfig = {}, canActivate = true, heatpipe, logger},
      MarketingPlugin
    ) {
      return async (ctx: Context, next) => {
        const marketing = MarketingPlugin.from(ctx);
        const {config} = marketing;

        canActivate && setCookieId(ctx, marketing.getCookieId(), config);
        await next();

        ctx.timing.end.then(async () => {
          // Publish tracking during request upstream for the status code
          if (!config.disableHeatpipe) {
            try {
              const trackingInfo = createTrackingPayload(
                ctx,
                marketing.getCookieId(),
                config
              );
              if (!shouldSkipTracking(ctx, trackingInfo)) {
                if (config.debugLogging) {
                  logger.info('[fusion-plugin-marketing] Tracking', {
                    marketingTrackingPayload: stringify(trackingInfo),
                  });
                }
                await heatpipe.asyncPublish(TRACK_TOPIC, trackingInfo);
              }
            } catch (e) {
              logger.error('[fusion-plugin-marketing] Unexpected Error', {
                error: e,
              });
            }
          }
        });
      };
    },
  });

export default ((plugin: any): FusionPlugin<empty, PluginServiceType>);
