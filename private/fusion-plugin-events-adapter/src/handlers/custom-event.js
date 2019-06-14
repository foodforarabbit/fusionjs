// @noflow
export default ({events, heatpipeEmitter, m3}) =>
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
    m3.increment('custom_web_event', {event_name: name});
  });
