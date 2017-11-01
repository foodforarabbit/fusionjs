import {Plugin} from 'fusion-core';
export default function(opts) {
  if (__DEV__ && opts) {
    throw Error(
      'Cannot pass dependencies to TracerPlugin in the browser. Try: `app.plugin(TracerPlugin, __NODE__ && {...})`'
    );
  }
  return new Plugin({
    Service: function() {
      throw new Error('Cannot instantiate TracerPlugin in the browser');
    },
  });
}
