// @flow
/* eslint-env node */
import {createPlugin} from 'fusion-core';
import HeatpipePublisher from '@uber/node-heatpipe-publisher';

import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import {HeatpipeClientToken, HeatpipeConfigToken} from './tokens';

import type {
  EventPayload,
  HeatpipePluginType,
  TopicInfoType,
  MessageType,
} from './types';

class NoopClient {
  constructor(...args) {}
  connect() {}
  publish(info, message, cb) {}
  destroy(cb: () => void) {}
}

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      heatpipeConfig: HeatpipeConfigToken.optional,
      M3: M3Token,
      Logger: LoggerToken,
      events: UniversalEventsToken,
      Client: HeatpipeClientToken.optional,
    },
    provides({heatpipeConfig = {}, M3, Logger, events, Client}) {
      const defaultClient = __DEV__ ? NoopClient : HeatpipePublisher;
      const HeatpipeClient = Client || defaultClient;
      const heatpipe = new HeatpipeClient({
        statsd: M3,
        m3Client: M3,
        logger: Logger,
        appId: process.env.SVC_ID || 'dev-service',
        schemaService: {
          host: 'localhost',
          port: 14040,
        },
        kafka: {
          proxyHost: 'localhost',
          proxyPort: 18084,
          maxRetries: 3,
        },
        exact: false,
        debugMode: __DEV__,
        publishToKafka: true,
        ...heatpipeConfig,
      });

      heatpipe.connect();

      events.on<EventPayload>('heatpipe:publish', ({topicInfo, message}) => {
        publish(topicInfo, message);
      });

      function asyncPublish(
        topicInfo: TopicInfoType,
        message: MessageType
      ): Promise<void> {
        return new Promise((resolve, reject) => {
          const result = publish(topicInfo, message);
          result instanceof Error ? reject(result) : resolve();
        });
      }

      function publish(
        topicInfo: TopicInfoType,
        message: MessageType
      ): Error | void {
        try {
          /*
            See https://code.uberinternal.com/diffusion/MENODE/browse/master/lib/heatpipe_publisher.js$107 for heatpipe.publish signature
            Ideal solution is to rewrite heatpipe.publish to not return 3 flavors of output.
            For now, we need to cover these returns from heatpipe.publish:
            1) undefined (publish succeeded)
            2) undefined (published failed, but callback(error) not returned)
            3) callback(error) (publish failed)
          */
          const result = heatpipe.publish(topicInfo, message, (e: Error) => {
            throw e;
          });
          return result;
        } catch (e) {
          return e;
        }
      }

      function destroy(cb?: () => void): void {
        // see https://code.uberinternal.com/diffusion/MENODE/browse/master/lib/heatpipe_publisher.js$213 for heatpipe.destroy signature
        heatpipe.destroy(cb || (() => {}));
        cb && cb();
      }

      return {
        asyncPublish,
        publish,
        destroy,
      };
    },
    cleanup: hp => new Promise(resolve => hp.destroy(resolve)),
  });

export default ((plugin: any): HeatpipePluginType);
