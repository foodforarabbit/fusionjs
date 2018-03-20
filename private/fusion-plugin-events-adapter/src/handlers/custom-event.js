export default ({events, heatpipeEmitter}) =>
  events.on('custom-hp-web-event', (payload, ctx) => {
    const {name, type, value, webEventsMeta} = payload;
    heatpipeEmitter.publishWebEvents({
      message: {
        name,
        type,
        value,
      },
      ctx,
      webEventsMeta,
    });
  });
