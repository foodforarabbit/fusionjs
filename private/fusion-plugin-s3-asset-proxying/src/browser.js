import {SingletonPlugin} from 'fusion-core';

export default args => {
  if (args && args.config) {
    throw new Error(
      'Cannot pass config parameters to s3 asset proxy in the browser. Try: `app.plugin(S3Plugin, __NODE__ && {...}`'
    );
  }
  function NoopService() {
    throw new Error('asset proxying is unavailable on the browser');
  }
  return new SingletonPlugin({Service: NoopService});
};
