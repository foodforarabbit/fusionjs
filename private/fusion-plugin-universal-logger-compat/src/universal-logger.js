const supportedLevels = [
  'trace',
  'debug',
  'info',
  'access',
  'warn',
  'error',
  'fatal',
];

export default class UniversalLogger {
  constructor() {
    supportedLevels.forEach(level => {
      this[level] = createBatchFn();
    });
  }
  setLogger(logger) {
    supportedLevels.forEach(level => {
      const loggerFn = logger[level].bind(logger);
      this[level].flush(loggerFn);
      this[level] = loggerFn;
    });
    this.createChild = logger.createChild.bind(logger);
  }
  createChild() {
    // TODO: Potentially should implement string prefixing, but not a huge deal
    return this;
  }
}

// TODO: this might be useful as a separate library to share between compat clients
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
