// @noflow
import structureMeta from '../utils/structure-meta';

export default ({events, heatpipeEmitter, m3}) =>
  events.on('custom-hp-web-event', (payload, ctx) => {
    const {name, type, value, _trackingMeta, webEventsMeta} = payload;

    heatpipeEmitter.publishWebEvents({
      message: {
        name,
        type,
        value,
        ...structureMeta(_trackingMeta),
      },
      ctx,
      webEventsMeta,
    });
    m3.increment('custom_web_event', {event_name: name});
  });
