// @flow
import {createPlugin} from 'fusion-core';

export default createPlugin({
  provides: () => {
    const calls = [];
    const callbackFunc = (methodName, ...args) => {
      // eslint-disable-next-line no-console
      calls.push([methodName, args]);
    };
    return {
      getCalls() {
        return calls;
      },
      scope(...args) {
        callbackFunc('scope', ...args);
      },
      close(...args) {
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
      immediateTiming(...args) {
        callbackFunc('immediateTiming', ...args);
      },
      immediateGauge(...args) {
        callbackFunc('immediateGauge', ...args);
      },
    };
  },
});
