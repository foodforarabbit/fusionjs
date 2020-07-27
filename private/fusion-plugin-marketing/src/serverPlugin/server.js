// @flow

import bodyParser from 'koa-bodyparser';
import {createPlugin, memoize} from 'fusion-core';
import stringify from 'fast-safe-stringify';
import parseDomain from 'parse-domain';
import type {FusionPlugin, Context} from 'fusion-core';
import type {PluginServiceType, PluginConfig, TrackResponse} from '../types.js';

import {LoggerToken} from 'fusion-tokens';
import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';
import {AnalyticsSessionToken} from '@uber/fusion-plugin-analytics-session';

import {TRACK_TOPIC, TRACK_URL} from '../constants';

import {getCookieId, setCookieId} from '../utils/cookies';
import {createTrackingPayload, shouldSkipTracking} from '../utils/tracking';

import {
  UberMarketingConfigToken,
  UberMarketingCanActivateToken,
} from '../tokens';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      userConfig: UberMarketingConfigToken.optional,
      canActivate: UberMarketingCanActivateToken.optional,
      heatpipe: HeatpipeToken,
      logger: LoggerToken,
      AnalyticsSession: AnalyticsSessionToken.optional,
    },
    provides({logger, heatpipe, AnalyticsSession, userConfig = {}}) {
      class MarketingPlugin {
        ctx: Context;
        config: PluginConfig;
        visitorUuid: string;
        trackingInfo: Object;
        additionalTrackingInfo: Object;

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

        setTrackingInfo(ctx = this.ctx) {
          const session_id = this.getAnalyticsSessionId(ctx) || 'unknown';
          try {
            this.trackingInfo = createTrackingPayload(
              ctx,
              {cookie_id: this.getCookieId(), session_id},
              this.config
            );
          } catch (e) {
            logger.error('[fusion-plugin-marketing] Unexpected Error', {
              error: e,
            });
          }
        }

        setAdditionalTrackingInfo(additionalTrackingInfo) {
          this.additionalTrackingInfo = additionalTrackingInfo;
        }

        getAnalyticsSessionId(ctx = this.ctx) {
          const {session_id} =
            (AnalyticsSession && AnalyticsSession.from(ctx)) || {};
          return session_id;
        }

        getCookieId() {
          return this.visitorUuid;
        }

        setCookieId() {
          setCookieId(this.ctx, this.getCookieId(), this.config);
        }

        shouldSkipTracking() {
          return (
            this.trackingInfo && shouldSkipTracking(this.ctx, this.trackingInfo)
          );
        }

        async publish() {
          if (this.trackingInfo) {
            const withAdditionalTrackingInfo = {
              ...this.trackingInfo,
              ...this.additionalTrackingInfo,
            };
            if (this.config.debugLogging) {
              logger.info('[fusion-plugin-marketing] Tracking', {
                marketingTrackingPayload: stringify(withAdditionalTrackingInfo),
              });
            }
            await heatpipe.asyncPublish(
              TRACK_TOPIC,
              withAdditionalTrackingInfo
            );
          }
        }

        async handleClientTrackRequest() {
          const ctx = this.ctx;
          const parseBody = bodyParser();
          await parseBody(ctx, () => Promise.resolve());
          this.setAdditionalTrackingInfo({
            captureSource: 'client',
            original_url: ctx.headers.referer || '',
            status_code: 200,
            ...ctx.request.body,
          });
          await this.track(ctx);
          const trackResponse: TrackResponse = {
            session_id: this.getAnalyticsSessionId(),
            cookie_id: this.getCookieId(),
          };
          return trackResponse;
        }

        async track(ctx?: Context = this.ctx) {
          // Publish tracking during request upstream for the status code
          if (!this.config.disableHeatpipe) {
            try {
              this.setTrackingInfo(ctx);
              if (!this.shouldSkipTracking()) {
                await this.publish();
              }
            } catch (e) {
              logger.error('[fusion-plugin-marketing] Unexpected Error', {
                error: e,
              });
            }
          }
        }
      }
      return {
        from: memoize(ctx => new MarketingPlugin(ctx)),
      };
    },
    middleware(
      {userConfig = {}, canActivate = true, heatpipe, logger, AnalyticsSession},
      MarketingPlugin
    ) {
      return async (ctx: Context, next) => {
        const marketing = MarketingPlugin.from(ctx);

        canActivate && marketing.setCookieId();

        // handle api call from MarketingBrowserPlugin
        if (ctx.path === TRACK_URL) {
          const trackResponse = await marketing.handleClientTrackRequest();
          ctx.body = ((trackResponse: any): JSON);
          return Promise.resolve();
        }
        await next();

        ctx.timing.end.then(async () => {
          await marketing.track(ctx);
        });
      };
    },
  });

export default ((plugin: any): FusionPlugin<empty, PluginServiceType>);
