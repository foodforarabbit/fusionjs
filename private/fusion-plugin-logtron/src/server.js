// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';
import {M3Token} from '@uber/fusion-plugin-m3';
import type {FusionPlugin} from 'fusion-core';
import type {Logger as LoggerType} from 'fusion-tokens';
import type {
  PayloadMetaType,
  ErrorLogOptionsType,
  LevelMapType,
} from './types.js';
import {ErrorTrackingToken, TeamToken, EnvOverrideToken} from './tokens.js';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import createSentryLogger from './utils/create-sentry-logger';
import createErrorTransform from './utils/create-error-transform';
import {isErrorLikeObject, isError} from './utils/error';
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

const m3Topic = 'fusion-logger';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
      m3: M3Token,
      errorTracker: ErrorTrackingToken.optional,
      team: TeamToken,
      envOverride: EnvOverrideToken.optional,
    },
    provides: ({events, m3, errorTracker, team, envOverride}) => {
      const env =
        envOverride ||
        (__DEV__
          ? 'dev'
          : process.env.UBER_RUNTIME_ENVIRONMENT || process.env.NODE_ENV);
      const envMeta = {
        appID: process.env.SVC_ID,
        runtimeEnvironment: env,
        deploymentName: process.env.GIT_DESCRIBE,
        gitSha: process.env.GITHUB_TOKEN,
      };

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
              envMeta.runtimeEnvironment
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
    }

    // stdout -> kafka
    console.log(
      formatStdout({level, message, meta}, envMeta.runtimeEnvironment)
    );

    // also log to healthline (via sentry) for errors
    // TODO: replace sentry with stderr logging once filebeat supports stderr->healthline
    if (envMeta.runtimeEnvironment === 'production') {
      const tags = (meta && meta.tags) || {};
      m3 && m3.increment(m3Topic, {level, ...tags});

      // also log to healthline (via sentry) for errors
      // TODO: replace sentry with stderr logging once filebeat supports stderr->healthline
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

        if (isError(meta)) {
          // case a
          // $FlowFixMe: we just proved meta is an error ^
          const err: Error = meta;
          meta = {error: err};
        } else if (isErrorLikeObject(meta) && !isErrorLikeObject(meta.error)) {
          // case b (but only if c or d don't apply)
          meta.message = String(meta.message || '');
          meta = {error: meta};
        }

        let formattedMeta: PayloadMetaType = meta;

        // case c and d (or a and b after above property reassignment)
        if (isErrorLikeObject(meta.error)) {
          formattedMeta = await transformError(meta);
        }

        if (callback && typeof callback === 'function') {
          callback(meta.error);
        }

        if (!formattedMeta.stack) {
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
        envMeta.runtimeEnvironment
      )
    );
  }
};

function validateLevel(level) {
  return level === 'log' || levelMap[level];
}

export default ((plugin: any): FusionPlugin<any, LoggerType>);
