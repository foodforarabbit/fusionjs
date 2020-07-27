// @flow
/* eslint-env browser */

import {createPlugin, memoize} from 'fusion-core';
import {FetchToken, LoggerToken} from 'fusion-tokens';
import type {Fetch} from 'fusion-tokens';
import type {FusionPlugin, Context} from 'fusion-core';
import type {BrowserPluginServiceType, TrackResponse} from '../types.js';
import {TRACK_URL} from '../constants';

const plugin =
  __BROWSER__ &&
  createPlugin({
    deps: {
      logger: LoggerToken,
      fetch: FetchToken,
    },
    provides({fetch}) {
      return {
        from: memoize(ctx => {
          class MarketingPlugin {
            fetch: Fetch;
            trackResponse: ?TrackResponse;

            constructor(fetch: Fetch) {
              this.fetch = fetch;
            }

            getTrackResponse() {
              return this.trackResponse;
            }

            async track() {
              const href = window.document.location.href;
              const queryString = href.split('?')[1] || '';
              const trackingInfo = {
                referrer: window.document.referrer || '',
              };
              this.trackResponse = await this.fetch(
                `${TRACK_URL}${queryString ? `?${queryString}` : ''}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(trackingInfo),
                }
              ).then(res => res.json());
            }
          }
          return new MarketingPlugin(fetch);
        }),
      };
    },
    middleware({logger}, MarketingPlugin) {
      return async (ctx: Context, next) => {
        try {
          const marketing = MarketingPlugin.from(ctx);
          await marketing.track();
        } catch (e) {
          logger.error(e);
        }
        return next();
      };
    },
  });

export default ((plugin: any): FusionPlugin<empty, BrowserPluginServiceType>);
