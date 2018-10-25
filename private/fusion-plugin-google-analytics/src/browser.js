// @flow
/* eslint-env browser */
import {createPlugin, createToken} from 'fusion-core';
import type {FusionPlugin} from 'fusion-core';

import loadGoogleAnalytics from './load-ga.js';

export const GoogleAnalyticsConfigToken = createToken('GoogleAnalyticsConfig');

const plugin =
  __BROWSER__ &&
  createPlugin({
    deps: {options: GoogleAnalyticsConfigToken},

    provides: ({options}) => {
      if (!options.trackingId) {
        throw new Error('Tracking id required');
      }
      options = Object.assign(
        {
          advertiserFeatures: false,
          anonymizeIp: false,
          cookieDomain: 'auto',
          linkAttribution: false,
          trackPage: true,
          loadGA: loadGoogleAnalytics,
        },
        options
      );
      if (!options.name) {
        // TODO: Maybe get the name from config.meta.project
        // Note: Google Analytics does not like '-' in the name
        // Tracker name is required in all subsequent command queue calls, see docs:
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference
        options.name = options.trackingId.replace(/-/g, '_');
      }
      class GoogleAnalytics {
        options: any;
        _ga: any;

        constructor() {
          this.options = options;

          // load ga script
          options.loadGA();

          this._ga = options.mock || window.ga;

          // Create named tracker
          this._ga(
            'create',
            options.trackingId,
            options.cookieDomain,
            options.name
          );

          // Initialize ga tracker features
          this._initializeFeatures();
        }
        ga(name: string, ...args): void {
          this._ga(this.options.name + name, ...args);
        }
        identify(id): void {
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id
          this.ga('.set', 'userId', id);
        }
        track(data): void {
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
          this.ga('.send', 'event', data);
        }
        pageview({title, page, location}): void {
          // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
          this.ga('.set', {
            title: title || document.title,
            page: page || window.location.pathname,
            location: location || window.location.href,
          });
          this.ga('.send', 'pageview');
        }
        _initializeFeatures(): void {
          var options = this.options;

          if (options.advertiserFeatures) {
            this.ga('.require', 'displayfeatures');
          }

          if (options.linkAttribution) {
            this.ga('.require', 'linkid', 'linkid.js');
          }

          if (options.trackPage) {
            this.ga('.send', 'pageview');
          }

          if (options.anonymizeIp) {
            this.ga('.set', 'anonymizeIp', true);
          }
        }
      }
      return new GoogleAnalytics();
    },
  });

export default ((plugin: any): FusionPlugin<any, any>);
