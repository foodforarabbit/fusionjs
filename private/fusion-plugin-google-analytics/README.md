# @uber/fusion-plugin-google-analytics

Google analytics plugin for fusion.

## Overview

This plugin provides a minimal api on top of google analytics exposed via a plugin api.

## Installation

```
npm install @uber/fusion-plugin-google-analytics
```

## Usage
```js
// main.js
import GoogleAnalyticsPlugin, {
  GoogleAnalyticsConfigToken, 
  GoogleAnalyticsToken
} from '@uber/fusion-plugin-google-analytics';

app.register(GoogleAnalyticsToken, GoogleAnalyticsPlugin);
app.register(GoogleAnalyticsConfigToken, {
  trackingId: '' // required
  advertiserFeatures: false, // optional
  anonymizeIp: false, // optional
  cookieDomain: 'auto', // optional
  linkAttribution: false, // optional
  trackPage: false, // optional
});

// use in the browser
if (__BROWSER__) {
  app.middleware({ ga: GoogleAnalyticsToken }, ({ga}) => {
    return (ctx, next) => {
      // see https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id
      ga.identify('user-id');

      // see https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
      ga.pageview({
        title: document.title,  // optional
        page: window.location.pathname,  // optional
        location: window.location.href, // optional
      });

      // see https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
      ga.track({
        eventCategory: '', // required
        eventAction: '', // required
        eventLabel: '', // optional
        eventValue: 0 // optional
      });
      return next();
    }
  })
}
```
