const analyticsOverrides = {
  // TODO: The current goal is to capture the reality of tealium.
  // A future goal will be to minimize this list.
  tealium: {
    childSrc: [
      'bs.serving-sys.com',
      'click.appcast.io',
      'analytics.recruitics.com',
      'ci.iasds01.com',
      'cdn.krxd.net',
      'www.facebook.com',
      '*.doubleclick.net',
      '*.tealiumiq.com',
      '*.demdex.net',
    ],
    frameSrc: [
      'bs.serving-sys.com',
      'click.appcast.io',
      'analytics.recruitics.com',
      'ci.iasds01.com',
      'cdn.krxd.net',
      'www.facebook.com',
      '*.doubleclick.net',
      '*.tealiumiq.com',
      '*.demdex.net',
    ],
    connectSrc: [
      'events.uber.com',
      'api.mixpanel.com',
      'd3i4yxtzktqr9n.cloudfront.net',
      '*.optimizely.com',
      'www.google-analytics.com',
      '*.tealiumiq.com',
      '*.demdex.net',
    ],
    scriptSrc: [
      "'unsafe-eval'",
      'script.crazyegg.com',
      'www.google-analytics.com',
      'maps.googleapis.com',
      'maps.google.com',
      'tags.tiqcdn.com',
      'beacon.krxd.net',
      'cdn.krxd.net',
      'cdn.mxpnl.com',
      'www.googleadservices.com',
      'www.ziprecruiter.com',
      'analytics.recruitics.com',
      'edge.quantserve.com',
      'secure.quantserve.com',
      'connect.facebook.net',
      'cdn.nanigans.com',
      'api.nanigans.com',
      '*.adroll.com',
      's.yimg.com',
      'sp.analytics.yahoo.com',
      'click.app-cast.com',
      'i.l.inmobicdn.net',
      '*.optimizely.com',
      '*.tealiumiq.com',
      '*.doubleclick.net',
      'static.ads-twitter.com',
    ],
    imgSrc: ['*'],
  },
  mixpanel: {
    scriptSrc: ['https://*.mxpnl.com'],
    connectSrc: ['https://api.mixpanel.com'],
  },
  googleAnalytics: {
    scriptSrc: [
      'https://www.google-analytics.com',
      'https://ssl.google-analytics.com',
    ],
    imgSrc: ['*'],
  },
  googleTagManager: {
    scriptSrc: ['https://www.googletagmanager.com'],
  },
};
export default analyticsOverrides;
