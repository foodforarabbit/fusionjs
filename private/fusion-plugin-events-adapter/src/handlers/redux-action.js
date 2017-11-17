// @flow
import type {HeatpipeClient} from '../emitters/heatpipe';
import type {M3} from '../emitters/m3';

export default function reduxAction(
  events: EventEmitter,
  heatpipe: HeatpipeClient,
  m3: M3
) {
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
    // TODO: Add origin here?
    m3.increment({key: 'action', tags: {action_type: type}});
  });
}
