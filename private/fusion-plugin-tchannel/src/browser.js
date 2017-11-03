import {SingletonPlugin} from 'fusion-core';
export default opts => {
  if (opts && opts.hyperbahnConfig)
    throw new Error(
      'Cannot pass hyperbahnConfig to tchannel in the browser. Try: `app.plugin(TchannelPlugin, __NODE__ && {...})`'
    );
  return new SingletonPlugin({
    Service: () => {
      throw new Error('Cannot instantiate tchannel in the browser');
    },
  });
};
