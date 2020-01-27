// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';

import type {FusionPlugin} from 'fusion-core';
import type {Logger as LoggerType} from 'fusion-tokens';
import type {ErrorLogOptionsType, LevelMapType} from './types.js';
import {ErrorTrackingToken, TeamToken, EnvOverrideToken} from './tokens.js';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import createSentryLogger from './utils/create-sentry-logger';
import createErrorTransform from './utils/create-error-transform';
import formatStdout from './utils/format-stdout';
import path from 'path';

const levelMap: LevelMapType = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
  silly: 'silly',
  verbose: 'verbose',
  trace: 'trace',
  access: 'access',
  fatal: 'fatal',
};

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
      errorTracker: ErrorTrackingToken.optional,
      team: TeamToken,
      envOverride: EnvOverrideToken.optional,
    },
    provides: ({events, errorTracker, team, envOverride}) => {
      const env = envOverride || (__DEV__ ? 'dev' : process.env.NODE_ENV);
      const transformError =
        env === 'production'
          ? createErrorTransform({
              path: path.join(
                process.cwd(),
                `.fusion/dist/${String(env)}/client`
              ),
              ext: '.map',
            })
          : _ => _;

      const sentryLogger =
        errorTracker && errorTracker.sentry
          ? createSentryLogger(errorTracker.sentry, team)
          : null;

      const wrappedLogger = {};

      wrappedLogger.destroy = () => {};

      const logEmitter = (level, message, meta, callback) => {
        events.emit('logger:log', {callback, level, message, meta});
        return wrappedLogger;
      };

      Object.keys(levelMap).forEach(tokenLevel => {
        wrappedLogger[tokenLevel] = (message, meta, callback) => {
          return logEmitter(levelMap[tokenLevel], message, meta, callback);
        };
      });

      wrappedLogger.log = logEmitter;
      wrappedLogger.createChild = () => wrappedLogger;

      events.on('logger:log', payload => {
        handleLog({
          transformError,
          payload,
          sentryLogger,
          env,
        });
      });

      return wrappedLogger;
    },
  });

export const handleLog = async (options: ErrorLogOptionsType) => {
  const {transformError, payload, env, sentryLogger} = options;

  let {level, message, meta, callback} = payload;

  if (validateLevel(level)) {
    // check for meta in message field
    if (typeof message !== 'string') {
      if (message && typeof message == 'object' && !meta) {
        meta = message;
      }
      message = '';
    }

    console.log(formatStdout({level, message, meta}, env));

    // also log to healthline (via sentry) for errors
    //TODO: replace sentry with stderr logging once filebeat supports stderr->healthline
    if (sentryLogger && env && env === 'production') {
      if (level === 'error' && sentryLogger && meta) {
        /*
         * three possible input formats for meta argument
         * a) <an error object>
         * b) {error: <an error object>}
         * c) {error: an object with error-like properties}
         *
         * in all three cases, Error properties will end up as root properties of `meta`
         */

        let formattedMeta = meta;

        if (isErrorMeta(meta)) {
          const parsedMeta = await transformError(meta);
          formattedMeta = {...meta, ...parsedMeta};
          if (!isError(meta.error)) {
            meta.error = createError(parsedMeta);
          }
        }

        if (callback && typeof callback === 'function') {
          callback(meta.error);
        }

        if (!formattedMeta.stack) {
          // otherwise sentry logger tries to create it's own local stack which is a useless destraction
          formattedMeta.stack = 'no stack available';
        }

        // No idea why Flow takes issue with this call. See https://github.com/winstonjs/winston/blob/master/lib/winston/logger.js#L201
        // $FlowFixMe
        sentryLogger.log('error', formattedMeta);
      }
    }
  } else {
    console.log(
      formatStdout(
        {
          level: 'warn',
          message: `logger called with unsupported method: ${level}`,
        },
        env
      )
    );
  }
};

function isErrorMeta(meta: any) {
  if (!meta) {
    return false;
  }
  return (meta.error && meta.error.stack) || (meta.source && meta.line);
}

function createError(meta) {
  const message = meta.message || 'unknown error occurred';
  const newErr = new Error(message);
  if (meta.stack) {
    newErr.stack = meta.stack;
  }
  return newErr;
}

function isError(err) {
  const errString = Object.prototype.toString.call(err);
  return errString === '[object Error]' || err instanceof Error;
}

function validateLevel(level) {
  return level === 'log' || levelMap[level];
}

export default ((plugin: any): FusionPlugin<any, LoggerType>);
