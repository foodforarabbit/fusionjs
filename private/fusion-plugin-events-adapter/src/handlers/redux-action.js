export default function reduxAction({events, heatpipe}) {
  events.on('redux-action-emitter:action', (payload, ctx) => {
    const {type, webEventsMeta} = payload;
    heatpipe.publishWebEvents({
      message: {
        type: 'action',
        name: type,
      },
      ctx,
      webEventsMeta,
    });
  });
}
