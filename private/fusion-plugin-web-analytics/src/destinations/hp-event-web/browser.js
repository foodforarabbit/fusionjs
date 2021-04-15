// @flow
import type {IEmitter} from '../../types';

export function HPEventWebEmitter({events}: {events: IEmitter}) {
  this.track = (data: any, {eventKey}: {eventKey: string}) => {
    // custom-hp-web-event is a custom handler from IEmitter that expects a strict format
    // See fusion-plugin-events-adapter, src/handlers/custom-event.js
    events.emit('custom-hp-web-event', {
      name: eventKey,
      type: 'action',
      value_map: data,
    });
  };
}
