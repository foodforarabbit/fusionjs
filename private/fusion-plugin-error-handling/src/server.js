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

  const errorLog = (e, captureType) => {
    const defaultMessage = `uncaught ${captureType} exception`;

    let _err = e;
    if (typeof _err !== 'object') {
      _err = {
        message: (typeof e === 'string' && e) || defaultMessage,
      };
    } else {
      _err.message = _err.message || defaultMessage;
    }

    _err.tags = {
      captureType,
    };

    return new Promise(resolve => {
      logger.fatal(_err.message, _err, resolve);
    });
  };
  const errorIncrement = captureType => {
    return new Promise(resolve => {
      m3.immediateIncrement('exception', {captureType}, resolve);
    });
  };
  return BasePlugin({
    onError: (e, captureType) => {
      return Promise.all([
        Promise.race([errorLog(e, captureType), delay(logTimeout)]),
        Promise.race([errorIncrement(captureType), delay(m3Timeout)]),
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
