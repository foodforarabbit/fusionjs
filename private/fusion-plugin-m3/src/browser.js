// @flow
/* eslint-env browser */
import {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import type {FusionPlugin} from 'fusion-core';
import type {
  M3DepsType,
  M3BrowserDepsType,
  BrowserServiceType,
  TagsType,
  ServiceType,
} from './types.js';

const plugin =
  __BROWSER__ &&
  createPlugin<M3BrowserDepsType, BrowserServiceType>({
    deps: {
      events: UniversalEventsToken,
    },
    provides: ({events}) => {
      return {
        counter(key: string, value: number, tags: TagsType) {
          events.emit('m3:counter', {key, value, tags});
        },
        increment(key: string, tags: TagsType) {
          events.emit('m3:increment', {key, tags});
        },
        decrement(key: string, tags: TagsType) {
          events.emit('m3:decrement', {key, tags});
        },
        timing(key: string, value: number | Date, tags: TagsType) {
          if (value instanceof Date) {
            value = Date.now() - value.getMilliseconds();
          }
          events.emit('m3:timing', {key, value, tags});
        },
        gauge(key: string, value: number, tags: TagsType) {
          events.emit('m3:gauge', {key, value, tags});
        },
      };
    },
  });

export default ((plugin: any): FusionPlugin<M3DepsType, ServiceType>);
