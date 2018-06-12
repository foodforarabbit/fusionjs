/* eslint-env node */
import path from 'path';
import Logtron from '@uber/logtron';
import {createPlugin, createToken} from 'fusion-core';
import {M3Token} from '@uber/fusion-plugin-m3';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import createErrorTransform from './create-error-transform';
import {supportedLevels} from './constants';

export const BackendsToken = createToken('LogtronBackends');
export const TeamToken = createToken('LogtronTeam');
export const TransformsToken = createToken('LogtronTransform');

function validateItem(item) {
  item = item || {};
  const {level, message} = item;
  if (!level || !supportedLevels.includes(level)) {
    return false;
  }
  if (typeof message !== 'string') {
    return false;
  }
  return true;
}

export default __NODE__ &&
  createPlugin({
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
      if (backends.sentry != null) {
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
      const logger = Logtron({
        meta: {team, project: service, runtime},
        statsd: m3,
        backends: Logtron.defaultBackends(backends),
        transforms,
      });

      // Logtron is missing LoggerToken interface methods so we need to define the custom levels
      // Utilize pre-existing methods and assign them to matching levels in the heirarchy
      logger.silly = logger.trace;
      logger.verbose = logger.info;
      // Define the log method
      logger.log = (level, payload) => {
        events.emit('logtron:log', payload);
      };

      // in dev we don't send client errors to the server
      if (env === 'production') {
        const transformError = createErrorTransform({
          path: path.join(process.cwd(), `.fusion/dist/${env}/client`),
          ext: '.map',
        });
        events.on('logtron:log', async payload => {
          handleLog(logger, transformError, payload);
        });
      }
      return logger;
    },
    cleanup: logger => logger.destroy(),
  });

export const handleLog = async (logger, transformError, payload) => {
  if (validateItem(payload)) {
    const {level, message} = payload;
    let {meta} = payload;
    if (isErrorMeta(meta)) {
      meta = {...meta, ...(await transformError(meta))};
    }
    logger[level](message, meta);
  } else {
    const error = new Error('Invalid data in log event');
    logger.error(error.message, error);
  }
};

function isErrorMeta(meta) {
  if (!meta) {
    return false;
  }
  return (meta.error && meta.error.stack) || (meta.source && meta.line);
}
