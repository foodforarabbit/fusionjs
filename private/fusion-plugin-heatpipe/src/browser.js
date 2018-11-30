// @flow
/* eslint-env browser */
import {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import type {HeatpipePluginType} from './types';

const plugin =
  __BROWSER__ &&
  createPlugin({
    deps: {
      UniversalEvents: UniversalEventsToken,
    },
    provides({UniversalEvents}) {
      const emitter = UniversalEvents;

      function publish(topicInfo, message) {
        emitter.emit('heatpipe:publish', {topicInfo, message});
      }

      return {
        publish,
        asyncPublish: (...args) => Promise.resolve(publish(...args)),
      };
    },
  });

export default ((plugin: any): HeatpipePluginType);
