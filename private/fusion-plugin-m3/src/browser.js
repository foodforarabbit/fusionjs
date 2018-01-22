/* eslint-env browser */
import {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

export default createPlugin({
  deps: {events: UniversalEventsToken},
  provides: ({events}) => {
    return {
      counter(key, value, tags) {
        events.emit('m3:counter', {key, value, tags});
      },
      increment(key, tags) {
        events.emit('m3:increment', {key, tags});
      },
      decrement(key, tags) {
        events.emit('m3:decrement', {key, tags});
      },
      timing(key, value, tags) {
        events.emit('m3:timing', {key, value, tags});
      },
      gauge(key, value, tags) {
        events.emit('m3:gauge', {key, value, tags});
      },
    };
  },
});
