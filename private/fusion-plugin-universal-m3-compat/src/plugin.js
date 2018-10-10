// @flow
import {createPlugin} from 'fusion-core';
import {M3Token} from '@uber/fusion-plugin-m3';
import UniversalM3 from './universal-m3.js';

// wrapped in a function here for easier testing
export default () => {
  const universalM3 = new UniversalM3();
  const plugin = createPlugin({
    deps: {
      m3: M3Token,
    },
    provides: ({m3}) => {
      universalM3.setM3(m3);
    },
  });
  return {m3: universalM3, plugin};
};
