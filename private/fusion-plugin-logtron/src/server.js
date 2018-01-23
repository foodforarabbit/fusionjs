/* eslint-env node */
import path from 'path';
import Logtron from '@uber/logtron';
import {createPlugin} from 'fusion-core';
import {createToken, createOptionalToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import createErrorTransform from './create-error-transform';

export const BackendsToken = createOptionalToken('LogtronBackends', {});
export const TeamToken = createToken('LogtronTeam');
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

export default createPlugin({
  deps: {
    events: UniversalEventsToken,
    m3: M3Token,
    backends: BackendsToken,
    team: TeamToken,
  },
  provides: ({events, m3, backends, team}) => {
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
    });

    // in dev we don't send client errors to the server
    if (env === 'production') {
      const transformError = createErrorTransform({
        path: path.join(process.cwd(), `.fusion/dist/${env}/client`),
        ext: '.map',
      });
      events.on('logtron:log', payload => {
        if (validateItem(payload)) {
          const {level, message} = payload;
          let {meta} = payload;
          if (isErrorMeta(meta)) {
            meta = transformError(meta);
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
});

function isErrorMeta(meta) {
  if (!meta) {
    return false;
  }
  return (meta.error && meta.error.stack) || (meta.source && meta.line);
}
