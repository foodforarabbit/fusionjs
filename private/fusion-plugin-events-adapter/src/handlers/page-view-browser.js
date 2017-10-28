export default function pageViewBrowser({events, heatpipe}) {
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
