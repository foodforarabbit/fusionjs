// @flow

import plugin from './plugin';
import withLogger from './hoc';

export type * from '@uber/fusion-plugin-logtron';

export {
  LogtronBackendsToken,
  LogtronTeamToken,
  LogtronTransformsToken,
  mock,
} from '@uber/fusion-plugin-logtron';

export default plugin;
export {withLogger};
