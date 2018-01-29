import {AtreyuMocker} from '@uber/atreyu-test';
import {createPlugin} from 'fusion-core';
import {AtreyuToken} from './tokens';

export default __NODE__ &&
  createPlugin({
    deps: {atreyu: AtreyuToken},
    provides({atreyu}) {
      return new AtreyuMocker(atreyu);
    },
  });
