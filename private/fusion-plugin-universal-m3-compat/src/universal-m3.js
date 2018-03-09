const supportedMethods = [
  'close',
  'counter',
  'increment',
  'decrement',
  'timing',
  'gauge',
  'immediateCounter',
  'immediateIncrement',
  'immediateDecrement',
  'immediateTiming',
  'immediateGauge',
];

export default class UniversalM3 {
  constructor() {
    supportedMethods.forEach(method => {
      this[method] = createBatchFn();
    });
  }
  setM3(m3) {
    supportedMethods.forEach(method => {
      const m3Fn = m3[method].bind(m3);
      this[method].flush(m3Fn);
      this[method] = m3Fn;
    });
    this.scope = m3.scope.bind(m3);
  }
  scope() {
    // TODO: Potentially should implement actual scoping, but not a huge deal
    return this;
  }
}

function createBatchFn() {
  let batch = [];
  let fn = (...args) => {
    batch.push(args);
  };
  function batchFn(...args) {
    return fn(...args);
  }
  batchFn.flush = flushFn => {
    batch.forEach(args => {
      flushFn(...args);
    });
    batch = [];
    fn = flushFn;
  };
  return batchFn;
}
