import {Plugin} from 'fusion-core';

export default function(opts) {
  if (__DEV__ && opts) {
    throw Error(
      'Cannot pass dependencies to AuthHeaders in the browser. Try: `app.plugin(AuthHeaders, __NODE__ && {...})`'
    );
  }
  return new Plugin({
    Service: function() {
      throw new Error('Cannot instantiate AuthHeaders in the browser');
    },
  });
}
