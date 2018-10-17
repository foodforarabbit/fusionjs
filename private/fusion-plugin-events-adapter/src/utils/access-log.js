// @flow
import type {Logger} from 'fusion-tokens';

type AccessMeta = {
  type: 'request' | 'pageview:server' | 'pageview:browser',
  url: string,
  route: string,
  timing: number,
  status: number,
};
export default function AccessLog(logger: Logger) {
  return function accessLog(meta: AccessMeta) {
    logger.info('access log', meta);
  };
}
