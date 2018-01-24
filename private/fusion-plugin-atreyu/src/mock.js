import {AtreyuMocker} from '@uber/atreyu-test';
import {createPlugin} from 'fusion-core';
import {AtreyuToken} from './server';

export default createPlugin({
  deps: {atreyu: AtreyuToken},
  provides({atreyu}) {
    return new AtreyuMocker(atreyu);
  },
});
