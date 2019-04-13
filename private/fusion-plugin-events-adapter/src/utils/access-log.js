// @flow
import type {UniversalEventsType} from 'fusion-plugin-universal-events';

type AccessMeta = {
  type: 'request' | 'pageview:server' | 'pageview:browser',
  url: string,
  route: string,
  timing: number,
  status: number,
};
export default function AccessLog(events: UniversalEventsType) {
  return function accessLog(meta: AccessMeta) {
    events.emit('access-log', meta);
  };
}
