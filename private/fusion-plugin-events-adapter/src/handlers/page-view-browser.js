export default function pageViewBrowser({events, heatpipe, analytics}) {
  if (__NODE__) {
    events.on('pageview:browser', (payload, ctx) => {
      const {page, title, webEventsMeta} = payload;
      heatpipe.publishWebEvents({
        message: {
          type: 'view',
          name: title,
          page,
        },
        ctx,
        webEventsMeta,
      });
    });
  }
  if (__BROWSER__ && analytics) {
    events.on('pageview:browser', ({page, title}) => {
      analytics.pageview({page, title});
    });
  }
}
