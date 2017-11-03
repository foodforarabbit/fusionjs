import ErrorHandlingPlugin from 'fusion-plugin-error-handling';
const defaultTimeout = 10000;
export default (
  {
    Logger,
    M3,
    CsrfProtection,
    logTimeout = defaultTimeout,
    m3Timeout = defaultTimeout,
    BasePlugin = ErrorHandlingPlugin,
  } = {}
) => {
  const {ignore} = CsrfProtection;
  const logger = Logger.of();
  const m3 = M3.of();

  const errorLog = (e, type) => {
    return new Promise(resolve => {
      logger.fatal(e.message || `uncaught ${type} exception`, e, resolve);
    });
  };
  const errorIncrement = type => {
    return new Promise(resolve => {
      m3.immediateIncrement('exception', {type}, resolve);
    });
  };
  return BasePlugin({
    onError: (e, type) => {
      return Promise.all([
        Promise.race([errorLog(e, type), delay(logTimeout)]),
        Promise.race([errorIncrement(type), delay(m3Timeout)]),
      ]);
    },
    CsrfProtection: {ignore},
  });
};

function delay(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}
