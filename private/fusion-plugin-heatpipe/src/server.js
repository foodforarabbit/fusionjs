// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import fetch from 'node-fetch';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import type {
  EventPayload,
  HeatpipePluginType,
  TopicInfoType,
  MessageType,
  PublishResponse,
} from './types';

// note that the payload needs to be escaped properly since it is json inside of json
export function getBody(
  appId: string,
  topic: string,
  version: number,
  message: MessageType
) {
  return JSON.stringify({
    appId,
    topic,
    version,
    payload: JSON.stringify(message),
  });
}

export function getRequestOptions(
  appId: string,
  topicInfo: TopicInfoType,
  message: MessageType
) {
  const {topic, version} = topicInfo;
  return {
    method: 'POST',
    body: getBody(appId, topic, version, message),
    headers: {
      'rpc-service': 'web-heatpipe',
      'rpc-procedure': 'com.uber.go.webheatpipe.WebHeatpipe::Publish',
      'rpc-caller': appId,
      'rpc-encoding': 'json',
      'context-ttl-ms': '5000',
    },
  };
}

const requestURL = 'http://127.0.0.1:5436';

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
      ): Promise<void> {
        if (__DEV__) return noopPublish(topicInfo, message);
        return fetch(requestURL, getRequestOptions(appId, topicInfo, message))
          .then(res => res.json())
          .then((res: PublishResponse) => {
            const {code, msg} = res;
            const {topic, version} = topicInfo;
            if (code === 'CODE_SUCCESS') {
              Logger.info(
                `Heatpipe Publish Success: ${appId}, ${topic}, v${version}`
              );
            } else {
              const errorMessage = `Heatpipe Publish Error [${code}, ${msg}]: ${appId}, ${topic}, v${version}, ${JSON.stringify(
                message
              )}`;
              Logger.info(errorMessage);
              throw new Error(errorMessage);
            }
          });
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
