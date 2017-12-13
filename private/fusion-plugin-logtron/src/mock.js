import {SingletonPlugin} from 'fusion-core';

// eslint-disable-next-line no-console
const log = (...args) => console.log(...args);

export default ({logFunc = log}) => {
  return new SingletonPlugin({
    Service: class Logger {
      log(...args) {
        logFunc(...args);
      }
    },
  });
};
