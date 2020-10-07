// @flow
import {createPlugin, type FusionPlugin} from 'fusion-core';

import type {M3DepsType, ServiceType} from './types.js';

const plugin: FusionPlugin<M3DepsType, ServiceType> = createPlugin({
  provides: () => {
    const calls = [];
    const callbackFunc = (methodName, ...args) => {
      // eslint-disable-next-line no-console
      calls.push([methodName, args]);
    };
    const client = {
      getCalls() {
        return calls;
      },
      scope(...args) {
        callbackFunc('scope', ...args);
        return client;
      },
      async close(...args) {
        callbackFunc('close', ...args);
      },
      increment(...args) {
        callbackFunc('increment', ...args);
      },
      decrement(...args) {
        callbackFunc('decrement', ...args);
      },
      counter(...args) {
        callbackFunc('counter', ...args);
      },
      histogram(...args) {
        callbackFunc('histogram', ...args);
      },
      timing(...args) {
        callbackFunc('timing', ...args);
      },
      gauge(...args) {
        callbackFunc('gauge', ...args);
      },
      immediateIncrement(...args) {
        callbackFunc('immediateIncrement', ...args);
      },
      immediateDecrement(...args) {
        callbackFunc('immediateDecrement', ...args);
      },
      immediateCounter(...args) {
        callbackFunc('immediateCounter', ...args);
      },
      immediateHistogram(...args) {
        callbackFunc('immediateHistogram', ...args);
      },
      immediateTiming(...args) {
        callbackFunc('immediateTiming', ...args);
      },
      immediateGauge(...args) {
        callbackFunc('immediateGauge', ...args);
      },
    };

    return client;
  },
});

export default plugin;
