/* eslint-env node */
import assert from 'assert';
import util from 'util';

import HeatpipePublisher from '@uber/node-heatpipe-publisher';
import {SingletonPlugin} from '@uber/graphene-plugin';

export default function({heatpipeConfig, M3, Logger, UniversalEvents,  Client=HeatpipePublisher}) {
  const m3 = M3 && M3.of();
  const logger = Logger && Logger.of();

  assert(m3, '{M3} is a required dependency of Heatpipe Plugin');
  assert(logger, '{Logger} is a required dependency of Heatpipe Plugin');

  const heatpipe = new Client({
    statsd: m3,
    m3Client: m3,
    logger,
    ...heatpipeConfig,
  });

  heatpipe.connect();

  const events = UniversalEvents.of();
  events.on('heatpipe:publish', ({topicInfo, message}) =>
    heatpipe.publish(topicInfo, message)
  );

  function HeatpipeServerPlugin() {
  }

  HeatpipeServerPlugin.prototype.asyncPublish = util.promisify(
    heatpipe.publish.bind(heatpipe)
  );
  HeatpipeServerPlugin.prototype.publish = heatpipe.publish.bind(heatpipe);
  HeatpipeServerPlugin.prototype.destroy = heatpipe.destroy.bind(heatpipe);

  return new SingletonPlugin({Service: HeatpipeServerPlugin});
}
