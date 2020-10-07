// @noflow
let supportedMethods = [
  'counter',
  'histogram',
  'increment',
  'decrement',
  'timing',
  'gauge',
];
if (__NODE__) {
  supportedMethods = supportedMethods.concat([
    'close',
    'immediateCounter',
    'immediateHistogram',
    'immediateIncrement',
    'immediateDecrement',
    'immediateTiming',
    'immediateGauge',
  ]);
}

export default class UniversalM3 {
  constructor() {
    supportedMethods.forEach(method => {
      this[method] = createBatchFn();
    });
    this.flushed = false;
  }
  setM3(m3) {
    if (this.flushed) return;
    this.flushed = true;
    supportedMethods.forEach(method => {
      const m3Fn = m3[method].bind(m3);
      this[method].flush(m3Fn);
      this[method] = m3Fn;
    });
    if (typeof m3.scope === 'function') {
      this.scope = m3.scope.bind(m3);
    }
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
