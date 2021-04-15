// @flow
/* eslint-env browser */
import loadGoogleAnalytics from './load-ga.js';

export class GoogleAnalytics {
  options: any;
  _ga: any;

  constructor({config}: {config: Object}) {
    if (!config.trackingId) {
      throw new Error('Tracking id required');
    }
    this.options = Object.assign(
      {
        advertiserFeatures: false,
        anonymizeIp: false,
        cookieDomain: 'auto',
        linkAttribution: false,
        trackPage: true,
        loadGA: loadGoogleAnalytics,
      },
      config
    );
    if (!this.options.name) {
      // TODO: Maybe get the name from config.meta.project
      // Note: Google Analytics does not like '-' in the name
      // Tracker name is required in all subsequent command queue calls, see docs:
      // https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference
      this.options.name = this.options.trackingId.replace(/-/g, '_');
    }

    // load ga script
    this.options.loadGA();

    this._ga = this.options.mock || window.ga;

    // Create named tracker
    this._ga(
      'create',
      this.options.trackingId,
      this.options.cookieDomain,
      this.options.name
    );

    // Initialize ga tracker features
    this._initializeFeatures();
  }
  ga(name: string, ...args: any): void {
    this._ga(this.options.name + name, ...args);
  }
  identify(id: string): void {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id
    this.ga('.set', 'userId', id);
  }
  track(data: any): void {
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    this.ga('.send', 'event', data);
  }
  pageview({
    title,
    page,
    location,
  }: {
    title?: string,
    page?: string,
    location?: string,
  }): void {
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

    if (options.appId) {
      this.ga('.set', 'appId', options.appId);
    }
  }
}
