import {Plugin} from 'fusion-core';

export default opts => {
  if (__DEV__ && opts)
    throw new Error(
      'Cannot pass options to secrets plugin in the browser. Try: `app.plugin(SecretsClient, __NODE__ && {...})`'
    );
  class Service {
    constructor() {
      throw new Error('Cannot instantiate secret service in the browser');
    }
  }
  return new Plugin({Service});
};
