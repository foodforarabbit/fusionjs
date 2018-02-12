// @flow
/* eslint-env browser */

// import to re-export preventing Rollup issues
import {
  LogtronBackendsToken,
  LogtronTeamToken,
} from '@uber/fusion-plugin-logtron';

import plugin from './plugin';
import withLogger from './hoc';

export {LogtronBackendsToken, LogtronTeamToken};

export default plugin;
export {withLogger};
