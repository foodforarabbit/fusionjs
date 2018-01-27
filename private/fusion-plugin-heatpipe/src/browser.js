/* eslint-env browser */
import {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

export default __BROWSER__ &&
  createPlugin({
    deps: {
      UniversalEvents: UniversalEventsToken,
    },
    provides({UniversalEvents}) {
      const emitter = UniversalEvents.from();

      return {
        publish(topicInfo, message) {
          emitter.emit('heatpipe:publish', {topicInfo, message});
        },
      };
    },
  });
