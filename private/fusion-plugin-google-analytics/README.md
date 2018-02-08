# @uber/fusion-plugin-google-analytics

This plugin provides a minimal API on top of Google Analytics.

---

### Installation

```sh
yarn add @uber/fusion-plugin-google-analytics
```

---

### Example
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

---

### API

```js
// main.js
import {GoogleAnalyticsConfigToken} from '@uber/fusion-plugin-google-analytics';

app.register(GoogleAnalyticsConfigToken, /*some config*/);
```

#### Dependency registration

##### Required dependencies

Name | Type | Description
-|-|-|-
`GoogleAnalyticsConfigToken` | `GoogleAnalyticsConfig` | Configuration object for Google Analytics.  See below for more information.

#### Service API

`identify(id: string): void` - See [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id)
`track(data: any): void)` - See [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)
`pageview({title: string, page: string, location: string}): void)` - See [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/pages)

---

### Configuration

The following options may be provided to this plugin.  Note that not all of them are required, and some have defaults:

```js
type GoogleAnalyticsConfig = {
  trackingId: number, // required
  name: string, // optional, defaults to trackingId.replace(/-/g, '_');
  advertiserFeatures: boolean, // optional, defaults to 'false'
  anonymizeIp: boolean, // optional, defaults to 'false'
  cookieDomain: string, // optional, defaults to 'auto'
  linkAttribution: boolean, // optional, defaults to 'false'
  trackPage: boolean, // optional, defaults to 'false'
  loadGA: Function, // optional, defaults to https://code.uberinternal.com/diffusion/WEFUSBE/browse/master/src/load-ga.js,
  mock: GoogleAnalytics // optional, defaults to 'undefined'
}
```
