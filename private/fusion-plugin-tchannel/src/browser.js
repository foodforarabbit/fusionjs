import {SingletonPlugin} from '@uber/graphene-plugin';
export default opts => {
  if (opts)
    throw new Error(
      'Cannot pass options to tchannel in the browser. Try: `app.plugin(TchannelPlugin, __NODE__ && {...})`'
    );
  return new SingletonPlugin({
    Service: () => {
      throw new Error('Cannot instantiate tchannel in the browser');
    },
  });
};
