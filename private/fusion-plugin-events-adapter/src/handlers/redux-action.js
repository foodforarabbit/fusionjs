import structureMeta from '../utils/structure-meta';

export default function reduxAction({events, heatpipeEmitter, m3}) {
  events.on('redux-action-emitter:action', (payload, ctx) => {
    const {type, _trackingMeta, webEventsMeta} = payload;
    heatpipeEmitter.publishWebEvents({
      message: {
        type: 'action',
        name: type,
        ...structureMeta(_trackingMeta),
      },
      ctx,
      webEventsMeta,
    });
    // TODO: Add origin here?
    m3.increment('action', {action_type: type});
  });
}
