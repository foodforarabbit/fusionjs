// @flow

import {createPlugin, memoize} from 'fusion-core';
import stringify from 'fast-safe-stringify';
import type {FusionPlugin, Context} from 'fusion-core';
import type {PluginServiceType, PluginConfig} from './types.js';

import {LoggerToken} from 'fusion-tokens';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';

import {TRACK_TOPIC} from './constants';

import {getCookieId, setCookieId} from './utils/cookies';
import {createTrackingPayload, shouldSkipTracking} from './utils/tracking';

import {UberMarketingConfigToken} from './tokens';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      userConfig: UberMarketingConfigToken,
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
          this.config = {
            cookieAge: 31536000,
            cookieIdKey: 'marketing_vistor_id',
            cookieDomain: __DEV__ ? 'localhost' : '.uber.com',
            serverDomain: '', // TODO: consolidate this to a single meta field
            disableHeatpipe: false,
            ...userConfig,
          };

          if (!this.config.serverDomain) {
            throw new Error(
              '[fusion-plugin-marketing] MISSING config.serverDomain = YOUR_WEB_APP_DOMAIN'
            );
          }

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
    middleware({userConfig = {}, heatpipe, logger}, MarketingPlugin) {
      return async (ctx: Context, next) => {
        const marketing = MarketingPlugin.from(ctx);
        const {config} = marketing;

        setCookieId(ctx, marketing.getCookieId(), config);
        await next();

        ctx.timing.end.then(() => {
          // Publish tracking during request upstream for the status code
          if (!config.disableHeatpipe) {
            try {
              const trackingInfo = createTrackingPayload(
                ctx,
                marketing.getCookieId(),
                config
              );
              if (!shouldSkipTracking(ctx, trackingInfo)) {
                logger.info('[fusion-plugin-marketing] Tracking', {
                  data: stringify(trackingInfo),
                });
                heatpipe.publish(TRACK_TOPIC, trackingInfo);
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
