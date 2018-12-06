// @flow
/* eslint-env browser */
import {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import type {FusionPlugin} from 'fusion-core';
import type {M3DepsType, ServiceType} from './types.js';

const plugin =
  __BROWSER__ &&
  createPlugin({
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

export default ((plugin: any): FusionPlugin<M3DepsType, ServiceType>);
