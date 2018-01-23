import {createPlugin} from 'fusion-core';

export default createPlugin({
  provides: () => {
    class Logger {
      constructor() {
        this.calls = [];
      }
      _mock(method, args) {
        this.calls.push([method, args]);
      }
      log(...args) {
        this._mock('log', args);
      }
      info(...args) {
        this._mock('info', args);
      }
      access(...args) {
        this._mock('access', args);
      }
      warn(...args) {
        this._mock('warn', args);
      }
      trace(...args) {
        this._mock('trace', args);
      }
      error(...args) {
        this._mock('error', args);
      }
      fatal(...args) {
        this._mock('fatal', args);
      }
      debug(...args) {
        this._mock('debug', args);
      }
      createChild(...args) {
        this._mock('createChild', args);
        return this;
      }
    }
    return new Logger();
  },
});
