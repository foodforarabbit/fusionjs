import {LoggerToken} from 'fusion-tokens';
import {createPlugin} from 'fusion-core';
import UniversalLogger from './universal-logger.js';

// wrapped in a function here for easier testing
export default () => {
  const universalLogger = new UniversalLogger();
  const plugin = createPlugin({
    deps: {
      logger: LoggerToken,
    },
    provides: ({logger}) => {
      universalLogger.setLogger(logger);
    },
  });
  return {logger: universalLogger, plugin};
};
