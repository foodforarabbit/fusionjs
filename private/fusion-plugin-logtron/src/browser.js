// @flow
import {createPlugin} from 'fusion-core';
import {M3Token} from '@uber/fusion-plugin-m3';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import type {FusionPlugin} from 'fusion-core';
import type {Logger as LoggerType} from 'fusion-tokens';

import {LoggerConfigToken} from './tokens.js';
import {levelMap} from './constants';
import type {IEmitter} from './types.js';

const plugin =
  __BROWSER__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
      m3: M3Token,
      config: LoggerConfigToken.optional,
    },
    provides: ({events, m3, config}) => {
      const minLogLevelName = config && config.minimumLogLevel;
      class UniversalLogger {
        emitter: IEmitter;

        constructor() {
          this.emitter = events;
          let minLogLevel;
          if (minLogLevelName) {
            const minLogLevelObj = levelMap[minLogLevelName];
            minLogLevel = minLogLevelObj && minLogLevelObj.level;
          }
          Object.keys(levelMap).forEach(key => {
            const {levelName, level} = levelMap[key];
            const logFn = (message, meta) => {
              // paradoxically, 0 log level is most critical, hence <=
              if (!minLogLevel || level <= minLogLevel) {
                return this.log(levelName, message, meta);
              } else {
                return () => {};
              }
            };
            // Cast to object to trick flow into thinking we have an indexer.
            (this: Object)[key] = logFn;
          });
        }

        log(level, message, meta) {
          // Supports the interface of logger[level](new Error('some-error'));
          if (message instanceof Error) {
            meta = message;
            message = meta.message;
          }
          // Supports the interface of logger[level]('message', new Error('some-error'));
          if (meta instanceof Error) {
            meta = {
              error: meta,
            };
          }
          // This is a hack required to make errors be json serializable.
          // There are alternative solutions, such as modifying the global Error prototype,
          // however that is most likely not the responsibility of this library.
          // See: http://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
          // for various workarounds
          if (meta && meta.error instanceof Error) {
            const error = {};
            Object.getOwnPropertyNames(meta.error).forEach(propName => {
              error[propName] = meta.error[propName];
            });
            meta.error = error;
          }

          return (
            this.emitter &&
            this.emitter.emit('logger:log', {level, message, meta})
          );
        }
      }
      return new UniversalLogger();
    },
  });

export default ((plugin: any): FusionPlugin<any, LoggerType>);
