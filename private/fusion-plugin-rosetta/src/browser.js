import {Plugin} from '@uber/graphene-plugin';
export default function(config) {
  if (__DEV__ && config) {
    throw new Error(
      'Cannot pass config to graphene-rosetta in the browser. Try: `app.plugin(RosettaPlugin, __NODE__ && {...}`'
    );
  }
  return new Plugin({
    Service: function Service() {
      throw new Error('Cannot use GrapheneRosetta in the browser');
    },
  });
}
