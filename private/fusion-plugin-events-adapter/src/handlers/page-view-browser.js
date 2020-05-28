// @noflow
export default function pageViewBrowser({events, heatpipeEmitter, analytics}) {
  if (__NODE__) {
    events.on('pageview:browser', (payload, ctx) => {
      const {page, title, webEventsMeta} = payload;
      heatpipeEmitter.publishWebEvents({
        message: {
          type: 'view',
          name: title,
          page: typeof page === 'string' ? {url: page} : page,
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
