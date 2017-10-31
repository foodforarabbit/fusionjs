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
import GoogleAnalyticsPlugin from '@uber/fusion-plugin-google-analytics';

const GA = app.plugin(GoogleAnalyticsPlugin, {
  trackingId: '' // required
  advertiserFeatures: false, // optional
  anonymizeIp: false, // optional
  cookieDomain: 'auto', // optional
  linkAttribution: false, // optional
  trackPage: false, // optional
});

// use in the browser
if (__BROWSER__) {
  // see https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id
  GA.of().identify('user-id');

  // see https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
  GA.of().pageview({
    title: document.title,  // optional
    page: window.location.pathname,  // optional
    location: window.location.href, // optional
  });

  // see https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
  GA.of().track({
    eventCategory: '', // required
    eventAction: '', // required
    eventLabel: '', // optional
    eventValue: 0 // optional
  });
}
```
