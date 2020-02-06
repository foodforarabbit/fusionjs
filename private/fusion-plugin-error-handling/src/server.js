// @flow

import uaParser from 'ua-parser-js';

import {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';

import type {FusionPlugin} from 'fusion-core';
import type {ErrorHandlingDepsType, ErrorHandlingServiceType} from './types';

const clientCaptureTypes = ['browser'];
const captureSources = {
  client: 'client',
  server: 'server',
};
const framework = 'fusion';

const defaultTimeout = 10000;
const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      logger: LoggerToken,
      m3: M3Token,
    },
    provides: ({logger, m3}) => {
      const errorLog = (e: Error, captureType: string, ctx) => {
        const defaultMessage = `uncaught ${captureType} exception`;
        const captureSource =
          clientCaptureTypes.indexOf(captureType) !== -1
            ? captureSources.client
            : captureSources.server;

        let _err: {message: string, tags?: {}} = e;
        if (typeof _err !== 'object') {
          _err = {
            message: (typeof e === 'string' && e) || defaultMessage,
          };
        } else {
          _err.message = _err.message || defaultMessage;
        }

        _err.tags = {
          captureType,
          captureSource,
          framework,
          ua: ctx && ctx.headers && uaParser(ctx.headers['user-agent']),
        };

        return new Promise(resolve => {
          logger.error(_err.message, _err, resolve);
        });
      };
      const errorIncrement = captureType => {
        return new Promise(resolve => {
          m3.immediateIncrement('exception', {captureType});
          resolve();
        });
      };

      return (e, captureType: string, ctx) => {
        const delayP = delay(defaultTimeout);
        return Promise.race([
          Promise.all([
            errorLog(e, captureType, ctx),
            errorIncrement(captureType),
          ]),
          delayP,
        ]).then(() => {
          delayP.cancel && delayP.cancel();
        });
      };
    },
  });

type DelayedPromise = Promise<void> & {cancel?: () => void};
function delay(time) {
  let id = null;
  let p: DelayedPromise = new Promise(resolve => {
    id = setTimeout(resolve, time);
  });
  p.cancel = () => {
    id && clearTimeout(id);
  };
  return p;
}

export default ((plugin: any): FusionPlugin<
  ErrorHandlingDepsType,
  ErrorHandlingServiceType
>);
