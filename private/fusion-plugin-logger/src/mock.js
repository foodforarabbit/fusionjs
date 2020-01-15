// @flow
import {createPlugin} from 'fusion-core';

import type {FusionPlugin} from 'fusion-core';
import type {Logger as LoggerType} from 'fusion-tokens';

const plugin = createPlugin({
  provides: () => {
    class Logger {
      constructor() {
        this.calls = [];
      }

      calls: Array<[string, mixed]>;

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
      silly(...args) {
        this._mock('silly', args);
      }
      warn(...args) {
        this._mock('warn', args);
      }
      verbose(...args) {
        this._mock('verbose', args);
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

export default ((plugin: any): FusionPlugin<empty, LoggerType>);
