// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import heatpipePublish from '@uber/heatpipe';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import type {
  EventPayload,
  HeatpipePluginType,
  TopicInfoType,
  MessageType,
  PublishResponse,
} from './types';

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
      Logger: LoggerToken,
    },
    provides({events, Logger}) {
      const appId = process.env.SVC_ID || 'dev-service';

      events.on<EventPayload>('heatpipe:publish', ({topicInfo, message}) => {
        asyncPublish(topicInfo, message);
      });

      function noopPublish(topicInfo: TopicInfoType, message: MessageType) {
        return Promise.resolve();
      }

      function asyncPublish(
        topicInfo: TopicInfoType,
        message: MessageType
      ): Promise<PublishResponse | void> {
        if (__DEV__) return noopPublish(topicInfo, message);
        return heatpipePublish(appId, topicInfo, message).then(
          (res: PublishResponse) => {
            const {code, msg} = res;
            const {topic, version} = topicInfo;
            if (code !== 'CODE_SUCCESS') {
              const errorMessage = `Heatpipe Publish Error [${code}, ${msg}]: ${appId}, ${topic}, v${version}, ${JSON.stringify(
                message
              )}`;
              Logger.info(errorMessage);
              throw new Error(errorMessage);
            }
            return res;
          }
        );
      }

      function publish(
        topicInfo: TopicInfoType,
        message: MessageType
      ): Error | void {
        Logger.warn(
          `publish() is deprecated and will be removed in future versions. Please use asyncPublish() instead.`
        );
        asyncPublish(topicInfo, message);
      }

      return {
        asyncPublish,
        publish,
      };
    },

    cleanup: hp => Promise.resolve(),
  });

export default ((plugin: any): HeatpipePluginType);
