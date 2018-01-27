import {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';

const defaultTimeout = 10000;
export default __NODE__ &&
  createPlugin({
    deps: {
      logger: LoggerToken,
      m3: M3Token,
    },
    provides: ({logger, m3}) => {
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

      return (e, captureType) => {
        const delayP = delay(defaultTimeout);
        return Promise.race([
          Promise.all([errorLog(e, captureType), errorIncrement(captureType)]),
          delayP,
        ]).then(() => {
          delayP.cancel();
        });
      };
    },
  });

function delay(time) {
  let id = null;
  let p = new Promise(resolve => {
    id = setTimeout(resolve, time);
  });
  p.cancel = () => clearTimeout(id);
  return p;
}
