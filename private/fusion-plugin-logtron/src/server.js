/* eslint-env node */
import assert from 'assert';
import path from 'path';
import Logtron from '@uber/logtron';
import {SingletonPlugin} from 'fusion-core';
import createErrorTransform from './create-error-transform';

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

export default ({UniversalEvents, M3, backends = {}, team, appName}) => {
  assert.ok(team, '{team} parameter is required');
  assert.ok(appName, '{appName} parameter is required');
  assert.ok(UniversalEvents, '{UniversalEvents} parameter is required');
  assert.ok(M3, '{M3} parameter is required');
  const env = __DEV__ ? 'dev' : process.env.NODE_ENV;
  if (backends.console !== false) {
    backends.console = true;
  }
  const statsd = M3.of();
  if (env === 'production') {
    backends.kafka = {
      proxyHost: 'localhost',
      proxyPort: 18084,
    };
  }
  const logger = Logtron({
    meta: {team, project: appName},
    statsd,
    backends: Logtron.defaultBackends(backends),
  });

  // in dev we don't send client errors to the server
  if (env === 'production') {
    const events = UniversalEvents.of();
    const transformError = createErrorTransform({
      path: path.join(process.cwd(), `.fusion/dist/${env}/client`),
      ext: '.map',
    });
    events.on('client-logging', payload => {
      if (validateItem(payload)) {
        const {level, message} = payload;
        let {meta} = payload;
        if (isErrorMeta(meta)) {
          meta = transformError(meta);
        }
        logger[level](message, meta);
      } else {
        const error = new Error(
          `Invalid data in client request for client-logging`
        );
        logger.error(error.message, error);
      }
    });
  }

  return new SingletonPlugin({
    Service: function() {
      return logger;
    },
  });
};

function isErrorMeta(meta) {
  if (!meta) {
    return false;
  }
  return (meta.error && meta.error.stack) || (meta.source && meta.line);
}
