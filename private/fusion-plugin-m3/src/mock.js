import {SingletonPlugin} from 'fusion-core';

const simpleLogCallback = (methodName, ...args) => {
  // eslint-disable-next-line no-console
  console.log(`Called ${methodName} with args: ${args}`);
};

export default ({callbackFunc = simpleLogCallback}) => {
  return new SingletonPlugin({
    Service: class M3 {
      scope(...args) {
        callbackFunc('scope', ...args);
      }
      close(...args) {
        callbackFunc('close', ...args);
      }
      increment(...args) {
        callbackFunc('increment', ...args);
      }
      decrement(...args) {
        callbackFunc('decrement', ...args);
      }
      counter(...args) {
        callbackFunc('counter', ...args);
      }
      timing(...args) {
        callbackFunc('timing', ...args);
      }
      gauge(...args) {
        callbackFunc('gauge', ...args);
      }
      immediateIncrement(...args) {
        callbackFunc('immediateIncrement', ...args);
      }
      immediateDecrement(...args) {
        callbackFunc('immediateDecrement', ...args);
      }
      immediateCounter(...args) {
        callbackFunc('immediateCounter', ...args);
      }
      immediateTiming(...args) {
        callbackFunc('immediateTiming', ...args);
      }
      immediateGauge(...args) {
        callbackFunc('immediateGauge', ...args);
      }
    },
  });
};
