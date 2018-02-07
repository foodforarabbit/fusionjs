export default function reduxAction({events, heatpipeEmitter, m3}) {
  events.on('redux-action-emitter:action', (payload, ctx) => {
    const {type, webEventsMeta} = payload;
    heatpipeEmitter.publishWebEvents({
      message: {
        type: 'action',
        name: type,
      },
      ctx,
      webEventsMeta,
    });
    // TODO: Add origin here?
    m3.increment('action', {action_type: type});
  });
}
