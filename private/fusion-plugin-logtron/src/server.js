/* eslint-env node */
import path from 'path';
import Logtron from '@uber/logtron';
import {createPlugin, createToken} from 'fusion-core';
import {M3Token} from '@uber/fusion-plugin-m3';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import createErrorTransform from './create-error-transform';

export const BackendsToken = createToken('LogtronBackends');
export const TeamToken = createToken('LogtronTeam');
export const TransformsToken = createToken('LogtronTransform');

const supportedLevels = [
  'trace',
  'debug',
  'info',
  'access',
  'warn',
  'error',
  'fatal',
];

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
        meta: {team, project: service},
        statsd: m3,
        backends: Logtron.defaultBackends(backends),
        transforms,
      });

      // in dev we don't send client errors to the server
      if (env === 'production') {
        const transformError = createErrorTransform({
          path: path.join(process.cwd(), `.fusion/dist/${env}/client`),
          ext: '.map',
        });
        events.on('logtron:log', async payload => {
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
        });
      }
      return logger;
    },
    cleanup: logger => logger.destroy(),
  });

function isErrorMeta(meta) {
  if (!meta) {
    return false;
  }
  return (meta.error && meta.error.stack) || (meta.source && meta.line);
}
