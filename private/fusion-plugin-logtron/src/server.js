// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';
import {M3Token} from '@uber/fusion-plugin-m3';
import type {FusionPlugin} from 'fusion-core';
import type {Logger as LoggerType} from 'fusion-tokens';
import type {PayloadMetaType, ErrorLogOptionsType} from './types.js';
import {
  ErrorTrackingToken,
  LoggerConfigToken,
  EnvOverrideToken,
} from './tokens.js';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import {levelMap} from './constants';
import createSentryLogger from './utils/create-sentry-logger';
import createErrorTransform from './utils/create-error-transform';
import {isErrorLikeObject} from './utils/error';
import formatStdout from './utils/format-stdout';
import path from 'path';

const m3Topic = 'fusion-logger';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
      m3: M3Token,
      errorTracker: ErrorTrackingToken.optional,
      config: LoggerConfigToken.optional,
      envOverride: EnvOverrideToken.optional,
    },
    provides: ({events, m3, errorTracker, config, envOverride}) => {
      const minLogLevelName = config && config.minimumLogLevel;
      const runtimeEnvironment =
        (envOverride && envOverride.uberRuntime) ||
        (__DEV__
          ? 'dev'
          : process.env.UBER_RUNTIME_ENVIRONMENT || process.env.NODE_ENV);
      // this includes staging
      const isProduction =
        (envOverride && envOverride.node === 'production') ||
        process.env.NODE_ENV === 'production';
      const envMeta = {
        appID: process.env.SVC_ID,
        isProduction,
        runtimeEnvironment,
        deploymentName: process.env.GIT_DESCRIBE,
        gitSha: process.env.GITHUB_TOKEN,
      };

      const transformError = isProduction
        ? createErrorTransform({
            path: path.join(process.cwd(), `.fusion/dist/production/client`),
            ext: '.map',
          })
        : _ => _;

      const sentryLogger =
        errorTracker && errorTracker.sentry
          ? createSentryLogger(errorTracker.sentry, runtimeEnvironment)
          : null;

      const wrappedLogger = {};

      wrappedLogger.destroy = () => {};

      const logEmitter = (level, message, meta, callback) => {
        events.emit('logger:log', {callback, level, message, meta});
        return wrappedLogger;
      };

      let minLogLevel;
      if (minLogLevelName) {
        const minLogLevelObj = levelMap[minLogLevelName];
        minLogLevel = minLogLevelObj && minLogLevelObj.level;
      }

      Object.keys(levelMap).forEach(key => {
        const {levelName, level} = levelMap[key];
        wrappedLogger[key] = (message, meta, callback) => {
          // paradoxically, 0 log level is most critical, hence <=
          if (!minLogLevel || level <= minLogLevel) {
            return logEmitter(levelName, message, meta, callback);
          } else {
            return () => {};
          }
        };
      });

      wrappedLogger.log = logEmitter;
      wrappedLogger.createChild = () => wrappedLogger;

      events.on('logger:log', payload => {
        try {
          handleLog({
            transformError,
            payload,
            sentryLogger,
            envMeta,
            m3,
          });
        } catch (e) {
          console.log(
            formatStdout(
              {
                level: 'warn',
                message: `error while logging to heathline: ${e}
payload = ${payload}`,
              },
              envMeta.isProduction
            )
          );
        }
      });

      return wrappedLogger;
    },
  });

export const handleLog = async (options: ErrorLogOptionsType) => {
  const {transformError, payload, envMeta, sentryLogger, m3} = options;

  let {level, message, meta, callback} = payload;

  if (validateLevel(level)) {
    // check for meta in message field
    if (typeof message !== 'string') {
      if (message && typeof message == 'object' && !meta) {
        meta = message;
      }
      message = '';
      callback = null;
    }

    // stdout -> kafka
    console.log(formatStdout({level, message, meta}, envMeta.isProduction));

    // also log to healthline (via sentry) for errors
    // TODO: replace sentry with stderr logging once filebeat supports stderr->healthline
    if (envMeta.isProduction) {
      let tags = {};
      if (meta && typeof meta.tags === 'object') {
        tags = meta.tags;
      }
      m3 && m3.increment(m3Topic, {level, ...tags});

      if (level === 'error' && sentryLogger && meta) {
        /*
         * four supported formats for meta argument
         * a) <an error object>
         * b) an object with error-like properties (but only if c or d don't apply)
         * c) {error: <an error object>}
         * d) {error: an object with error-like properties}
         *
         * in all four cases, Error properties will end up as root properties of `formattedMeta`
         */

        // healthline uses `meta` for message, make sure it gets a message
        if (meta && typeof meta === 'object' && !meta.message) {
          meta.message = message;
        }

        if (isErrorLikeObject(meta) && !isErrorLikeObject(meta.error)) {
          // cases a and b (but only if c or d don't apply)
          meta = {error: meta};
        }

        let formattedMeta: PayloadMetaType = meta;

        if (isErrorLikeObject(meta.error)) {
          // case c and d (or a and b after above property reassignment)
          formattedMeta = await transformError(meta);
        }

        if (callback && typeof callback === 'function') {
          callback(meta.error);
        }

        if (
          formattedMeta &&
          typeof formattedMeta === 'object' &&
          !formattedMeta.stack
        ) {
          // otherwise sentry logger tries to create it's own local stack which is a useless distraction
          formattedMeta.stack = 'not available';
        }

        // No idea why Flow takes issue with this call. See https://github.com/winstonjs/winston/blob/master/lib/winston/logger.js#L201
        // $FlowFixMe
        sentryLogger.log('error', {
          tags,
          ...formattedMeta,
          ...envMeta,
        });
      }
    }
  } else {
    console.log(
      formatStdout(
        {
          level: 'warn',
          message: `logger called with unsupported method: ${level}`,
        },
        envMeta.isProduction
      )
    );
  }
};

function validateLevel(level) {
  return level === 'log' || levelMap[level];
}

export default ((plugin: any): FusionPlugin<any, LoggerType>);
