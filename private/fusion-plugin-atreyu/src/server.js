import Atreyu from '@uber/atreyu';
import {SingletonPlugin} from '@uber/graphene-plugin';

export default ({config, options, Client = Atreyu} = {}) => {
  const atreyu = new Client(config, options);
  return new SingletonPlugin({
    Service: function AtreyuPlugin() {
      return atreyu;
    },
  });
};
