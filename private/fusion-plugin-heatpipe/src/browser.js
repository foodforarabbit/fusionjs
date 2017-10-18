/* eslint-env browser */
import {Plugin} from '@uber/graphene-plugin';

export default function({UniversalEvents}) {
  return class HeatpipeBrowserPlugin extends Plugin {
    constructor(ctx) {
      super(ctx);
      const emitter = UniversalEvents.of();
      this.emit = emitter.emit.bind(emitter);
    }
    publish(topicInfo, message) {
      this.emit('heatpipe:publish', {topicInfo, message});
    }
  };
}
