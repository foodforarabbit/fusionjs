// @flow
/* eslint-env node */
import path from 'path';
import Logtron from '@uber/logtron';
import {createPlugin} from 'fusion-core';
import {M3Token} from '@uber/fusion-plugin-m3';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import createErrorTransform from './create-error-transform';
import {supportedLevels} from './constants';

import type {FusionPlugin} from 'fusion-core';
import type {Logger as LoggerType} from 'fusion-tokens';
import type {PayloadType, PayloadMetaType, LogtronDepsType} from './types.js';
import {BackendsToken, TeamToken, TransformsToken} from './tokens.js';

function validateItem(item) {
  item = item || {};
  const {level} = item;
  if (!level || !supportedLevels.includes(level)) {
    return false;
  }
  return true;
}

const plugin =
  __NODE__ &&
  createPlugin<LogtronDepsType, LoggerType>({
    deps: {
      events: UniversalEventsToken,
      m3: M3Token,
      backends: BackendsToken.optional,
      team: TeamToken,
      transforms: TransformsToken.optional,
    },
    provides: ({events, m3, backends = {}, team, transforms}) => {
      const env = __DEV__ ? 'dev' : process.env.NODE_ENV;
      const service = process.env.SVC_ID || 'dev-service';
      const runtime = process.env.UBER_RUNTIME_ENVIRONMENT || '';
      if (backends.console !== false) {
        backends.console = true;
      }
      // Default json logs to true in production for integration with healthline/elk via filebeat
      if (env === 'production' && backends.json !== false) {
        backends.json = true;
      }
      if (backends.sentry != null) {
        //Override default `backends.sentry.computeErrLoc` in sentry config
        if (__DEV__) {
          delete backends.sentry;
        }
      }
      if (env === 'production') {
        backends.kafka = {
          proxyHost: 'localhost',
          proxyPort: 18084,
        };
      }
      const logtron = Logtron({
        meta: {team, project: service, runtime},
        statsd: m3,
        backends: Logtron.defaultBackends(backends),
        transforms,
      });

      // Logtron is missing LoggerToken interface methods so we need to define the custom levels
      // Utilize pre-existing methods and assign them to matching levels in the heirarchy
      const levelMap = {
        error: 'error',
        warn: 'warn',
        info: 'info',
        debug: 'debug',
        silly: 'trace',
        verbose: 'info',
        trace: 'trace',
        access: 'access',
        fatal: 'fatal',
      };
      const wrappedLogger = {};

      wrappedLogger.destroy = () => logtron.destroy();

      // We process all log methods through the error transformer.
      const logEmitter = (level, message, meta, callback) => {
        events.emit('logtron:log', {callback, level, message, meta});
        return wrappedLogger;
      };

      Object.keys(levelMap).forEach(tokenLevel => {
        wrappedLogger[tokenLevel] = (message, meta, callback) => {
          logEmitter(levelMap[tokenLevel], message, meta, callback);
          return wrappedLogger;
        };
      });
      wrappedLogger.log = logEmitter;
      // TODO: Consider implementing a real createChild. For now, this is simply a chainable noop.
      wrappedLogger.createChild = () => wrappedLogger;

      const transformError =
        env === 'production'
          ? createErrorTransform({
              path: path.join(process.cwd(), `.fusion/dist/${env}/client`),
              ext: '.map',
            })
          : // in dev we don't send client errors to the server
            o => o;
      events.on('logtron:log', payload => {
        handleLog(logtron, transformError, payload);
      });

      return wrappedLogger;
    },
    // $FlowFixMe
    cleanup: logtron => logtron.destroy(),
  });

export const handleLog = async (
  logger: LoggerType,
  transformError: PayloadMetaType => {},
  payload: PayloadType
) => {
  const {callback} = payload;

  if (validateItem(payload)) {
    const {level} = payload;
    let {meta, message} = payload;
    if (isErrorMeta(meta)) {
      const parsedMeta = await transformError(meta);
      meta = {...meta, ...parsedMeta};
      if (!isError(meta.error)) {
        meta.error = createError(parsedMeta);
      }
    }
    if (typeof message !== 'string') {
      if (message && typeof message == 'object' && !meta) {
        meta = message;
        message = '';
      } else {
        message = '';
      }
    }
    logger[level](message, meta, callback);
  } else {
    const error = new Error('Invalid data in log event');

    if (callback && typeof callback === 'function') {
      callback(error);
    }

    logger.error(error.message, error);
  }
};

function isError(err) {
  const errString = Object.prototype.toString.call(err);
  return errString === '[object Error]' || err instanceof Error;
}

function createError(meta) {
  // $FlowFixMe
  const message = meta.message || 'unknown error occurred';
  const newErr = new Error(message);
  // $FlowFixMe
  if (meta.stack) {
    newErr.stack = meta.stack;
  }
  return newErr;
}

function isErrorMeta(meta) {
  if (!meta) {
    return false;
  }
  return (meta.error && meta.error.stack) || (meta.source && meta.line);
}

export default ((plugin: any): FusionPlugin<LogtronDepsType, LoggerType>);
