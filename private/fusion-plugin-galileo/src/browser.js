import {Plugin} from 'fusion-plugin';
export default function(options) {
  if (__DEV__ && options) {
    throw new Error(
      'Cannot pass parameters to Galileo plugin in the browser. Try: `app.plugin(GalileoPlugin, __NODE__ && {...})`'
    );
  }
  return new Plugin({
    Service: function() {
      throw new Error('Cannot use GalileoPlugin in the browser');
    },
  });
}
