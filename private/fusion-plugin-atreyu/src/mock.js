import {AtreyuMocker} from '@uber/atreyu-test';
import {SingletonPlugin} from 'fusion-core';

export default (args = {}) => {
  const {Atreyu} = args;
  const atreyu = Atreyu.of();
  const atreyuMocker = new AtreyuMocker(atreyu);

  return new SingletonPlugin({
    Service: function AtreyuPlugin() {
      return atreyuMocker;
    },
  });
};
