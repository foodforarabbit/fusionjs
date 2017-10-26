/* eslint-env node */
import path from 'path';
import Logtron from '@uber/logtron';
import LoggerStream from '@uber/logtron/backends/logger-stream';
import winston from 'winston';
import {Plugin} from '@uber/graphene-plugin';
import createErrorTransform from './create-error-transform';

const InMemory = winston.transports.Memory;

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

class InMemoryLogger {
  createStream() {
    return new LoggerStream(new InMemory({json: true}), {});
  }
}

export default ({UniversalEvents, M3, backends = {}, meta}) => {
  const env = __DEV__ ? 'dev' : process.env.NODE_ENV;
  if (__DEV__) {
    backends.console = true;
  }
  const statsd = M3.of();
  if (env === 'production') {
    backends.kafka = {
      proxyHost: 'localhost',
      proxyPort: 18084,
    };
  }
  const logtronBackends = Logtron.defaultBackends(backends);
  // TODO: We can maybe remove this, since testing can be done via listening to
  // the server events.
  if (backends.memory) {
    // This takes the console transport and replaces it with a memory transport
    // access at: logger.mainLogger.streams.console.logger.writeOutput
    backends.console = new InMemoryLogger();
  }
  const logger = Logtron({
    meta,
    statsd,
    backends: logtronBackends,
  });

  class UniversalLogger extends Plugin {
    constructor() {
      super();
      this.logger = logger;
    }
  }

  // in dev we don't send client errors to the server
  if (env === 'production') {
    const events = UniversalEvents.of();
    const transformError = createErrorTransform({
      path: path.join(process.cwd(), `.framework/dist/${env}/client`),
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

  return UniversalLogger;
};

function isErrorMeta(meta) {
  if (!meta) {
    return false;
  }
  return (meta.error && meta.error.stack) || (meta.source && meta.line);
}
