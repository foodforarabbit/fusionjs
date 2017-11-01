import {SingletonPlugin} from 'fusion-core';
export default opts => {
  if (opts)
    throw new Error(
      'Cannot pass options to atreyu in the browser. Try: `app.plugin(AtreyuPlugin, __NODE__ && {...})`'
    );
  return new SingletonPlugin({
    Service: () => {
      throw new Error('Cannot use atreyu in the browser');
    },
  });
};
