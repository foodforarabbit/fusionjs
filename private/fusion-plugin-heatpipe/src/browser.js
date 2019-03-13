// @flow
/* eslint-env browser */
import {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import type {HeatpipePluginType, TopicInfoType, MessageType} from './types';

const plugin =
  __BROWSER__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
    },
    provides({events}) {
      function publish(topicInfo: TopicInfoType, message: MessageType): void {
        events.emit('heatpipe:publish', {topicInfo, message});
      }

      async function asyncPublish(
        topicInfo: TopicInfoType,
        message: MessageType
      ): Promise<void> {
        publish(topicInfo, message);
      }

      return {
        publish,
        asyncPublish,
      };
    },
  });

export default ((plugin: any): HeatpipePluginType);
