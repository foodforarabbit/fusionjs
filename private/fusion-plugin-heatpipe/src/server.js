/* eslint-env node */
import {createPlugin, createToken} from 'fusion-core';
import util from 'util';

import HeatpipePublisher from '@uber/node-heatpipe-publisher';

import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import {HeatpipeConfigToken} from './tokens';

export const HeatpipeClientToken = createToken('HeatpipeClientToken');

export default __NODE__ &&
  createPlugin({
    deps: {
      heatpipeConfig: HeatpipeConfigToken.optional,
      M3: M3Token,
      Logger: LoggerToken,
      events: UniversalEventsToken,
      Client: HeatpipeClientToken.optional,
    },
    provides({heatpipeConfig = {}, M3, Logger, events, Client}) {
      Client = Client || HeatpipePublisher;

      const defaultHeatpipeConfig = {
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
      };

      const heatpipe = new Client({
        statsd: M3,
        m3Client: M3,
        logger: Logger,
        ...defaultHeatpipeConfig,
        ...heatpipeConfig,
      });

      heatpipe.connect();

      events.on('heatpipe:publish', ({topicInfo, message}) =>
        heatpipe.publish(topicInfo, message)
      );

      return {
        asyncPublish: util.promisify(heatpipe.publish.bind(heatpipe)),
        publish: heatpipe.publish.bind(heatpipe),
        destroy: heatpipe.destroy.bind(heatpipe),
      };
    },
    cleanup: hp => new Promise(resolve => hp.destroy(resolve)),
  });
