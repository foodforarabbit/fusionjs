// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import heatpipePublish from '@uber/heatpipe';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {HeatpipeConfigToken} from './tokens';

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
      config: HeatpipeConfigToken.optional,
    },
    provides({events, Logger, config}) {
      const appId = process.env.SVC_ID || 'dev-service';

      if (!config || !config.ignoreUniversalEvents) {
        events.on<EventPayload>('heatpipe:publish', ({topicInfo, message}) => {
          asyncPublish(topicInfo, message);
        });
      }

      function noopPublish(topicInfo: TopicInfoType, message: MessageType) {
        return Promise.resolve();
      }

      async function asyncPublish(
        topicInfo: TopicInfoType,
        message: MessageType
      ): Promise<PublishResponse | void> {
        try {
          if (__DEV__) return noopPublish(topicInfo, message);
          return await heatpipePublish(appId, topicInfo, message);
        } catch (e) {
          Logger.error(
            `[fusion-plugin-heatpipe error], ${JSON.stringify(
              topicInfo
            )}, ${JSON.stringify(message)}`,
            e
          );
        }
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
