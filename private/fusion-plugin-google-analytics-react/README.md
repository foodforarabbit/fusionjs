# @uber/fusion-plugin-google-analytics-react

[![Build status](https://badge.buildkite.com/e962e49f800a98e953516b0d036bc66501ccb5e90dcd7eff2f.svg?branch=master)](https://buildkite.com/uber/fusionjs)

This plugin provides a minimal wrapper on top of Google Analytics. Google Analytics provides useful analytics for understanding traffic volume and patterns.

------

### Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Setup](#setup)
- [API](#api)
  - [Registration API](#registration-api)
    - [`GoogleAnalytics`](#googleanalytics)
    - [`GoogleAnalyticsToken`](#googleanalyticstoken)
  - [Dependencies](#dependencies)
    - [`GoogleAnalyticsConfigToken`](#googleanalyticsconfigtoken)
  - [Service API](#service-api)
    - [`identify`](#identify)
    - [`track`](#track)
    - [`pageview`](#pageview)

------

### Installation

```sh
yarn add @uber/fusion-plugin-google-analytics-react
```

------

### Usage

#### React

```js
import React from 'react';
import {withGoogleAnalytics} from 'fusion-plugin-google-analytics-react';

const SignupButton = ({googleAnalytics}) => {
  // see https://developers.google.com/analytics/devguides/collection/analyticsjs/events
  const trackingData = {
    eventCategory: 'web.awesome-service.signup',
    eventAction: 'start'
  };
  return <button onClick={() => googleAnalytics.track(trackingData)}>Signup Here</button>;
};

export default withGoogleAnalytics(SignupButton);
```

#### Plugins

```js
if (__BROWSER__) {
  app.middleware({ga: GoogleAnalyticsToken}, ({ga}) => {
    return (ctx, next) => {
      // see https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id
      ga.identify('user-id');

      // see https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
      ga.pageview({
        title: document.title, // optional
        page: window.location.pathname, // optional
        location: window.location.href, // optional
      });

      // see https://developers.google.com/analytics/devguides/collection/analyticsjs/events
      ga.track({
        eventCategory: '', // required
        eventAction: '', // required
        eventLabel: '', // optional
        eventValue: 0, // optional
      });
      return next();
    };
  });
}
```

------

### Setup

```js
// main.js
import GoogleAnalytics, {
  GoogleAnalyticsConfigToken,
  GoogleAnalyticsToken
} from '@uber/fusion-plugin-google-analytics-react';

app.register(GoogleAnalyticsToken, GoogleAnalytics);

if (__NODE__) {
  // ...
} else {
  // ...
  app.register(GoogleAnalyticsConfigToken, {
    trackingId: '' // required
    advertiserFeatures: false, // optional
    anonymizeIp: false, // optional
    cookieDomain: 'auto', // optional
    linkAttribution: false, // optional
    trackPage: false, // optional
  });   
}
```

------

### API

#### Registration API

##### `GoogleAnalytics`

The plugin. Register it to [`GoogleAnalyticsToken`](#googleanalyticstoken)

##### `GoogleAnalyticsToken`

Register it with the [`GoogleAnalytics`](#googleanalytics) plugin

#### Dependencies

##### `GoogleAnalyticsConfigToken`

Configuration for Google Analytics

###### Types

```js
type GoogleAnalyticsConfig = {
  trackingId: number, // required
  name: string, // optional, defaults to trackingId.replace(/-/g, '_');
  advertiserFeatures: boolean, // optional, defaults to 'false'
  anonymizeIp: boolean, // optional, defaults to 'false'
  cookieDomain: string, // optional, defaults to 'auto'
  linkAttribution: boolean, // optional, defaults to 'false'
  trackPage: boolean, // optional, defaults to 'true'
  loadGA: Function, // optional, defaults to https://code.uberinternal.com/diffusion/WEFUSBE/browse/master/src/load-ga.js,
  mock: GoogleAnalytics, // optional, for testing, provides a mock implementation of window.ga, defaults to 'undefined'
};
```

#### Service API

##### `identify`

`ga.identify(id: string): void` - See [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id)

##### `track`

`ga.track(data: any): void)` - See [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)

##### `pageview`

`pageview({title: string, page: string, location: string}): void)` - See [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/pages)