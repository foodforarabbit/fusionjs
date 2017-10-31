/* eslint-env browser */
import {SingletonPlugin} from 'fusion-plugin';

export default function({UniversalEvents}) {
  class HeatpipeBrowserPlugin {
    constructor() {
      const emitter = UniversalEvents.of();
      this.emit = emitter.emit.bind(emitter);
    }
    publish(topicInfo, message) {
      this.emit('heatpipe:publish', {topicInfo, message});
    }
  }
  return new SingletonPlugin({Service: HeatpipeBrowserPlugin});
}
