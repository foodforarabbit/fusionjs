// @flow

import plugin from './plugin';
import withLogger from './hoc';

export type * from '@uber/fusion-plugin-logtron';

export {
  // TODO: temporarily renamed exports for logtron backwards compat
  // (they now have nothing to do with logtron)
  LogtronBackendsToken,
  LogtronTeamToken,
  // LoggerErrorTrackingToken,
  // LoggerTeamToken,
  mock,
} from '@uber/fusion-plugin-logtron';

export default plugin;
export {withLogger};
