/* eslint-env node */
import {createPlugin} from 'fusion-core';
import util from 'util';

import HeatpipePublisher from '@uber/node-heatpipe-publisher';

import {createOptionalToken, LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import {HeatpipeConfigToken} from './tokens';

export const HeatpipeClientToken = createOptionalToken(
  'HeatpipeClientToken',
  HeatpipePublisher
);

export default createPlugin({
  deps: {
    heatpipeConfig: HeatpipeConfigToken,
    M3: M3Token,
    Logger: LoggerToken,
    UniversalEvents: UniversalEventsToken,
    Client: HeatpipeClientToken,
  },
  provides({heatpipeConfig, M3, Logger, UniversalEvents, Client}) {
    const heatpipe = new Client({
      statsd: M3,
      m3Client: M3,
      logger: Logger,
      ...heatpipeConfig,
    });

    heatpipe.connect();

    const events = UniversalEvents.from();
    events.on('heatpipe:publish', ({topicInfo, message}) =>
      heatpipe.publish(topicInfo, message)
    );

    return {
      asyncPublish: util.promisify(heatpipe.publish.bind(heatpipe)),
      publish: heatpipe.publish.bind(heatpipe),
      destroy: heatpipe.destroy.bind(heatpipe),
    };
  },
});
