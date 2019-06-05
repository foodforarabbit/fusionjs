// @noflow
/* global process */
/* eslint-disable no-console */

import {serverPerfCollector, adaptForHeatpipe} from '@uber/web-perf-collector';
import publish from '@uber/heatpipe';

export default function publishToHeatpipe(
  {enhancedMetrics: metrics, __url__: route},
  ctx,
  config = {
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
    fusion: true,
  }
) {
  const req = ctx.request;

  // these functions are only expected to be overriden by tests
  const publishFn = config.publishFn || publish;
  const adaptForHeatpipeFn = config.adaptForHeatpipeFn || adaptForHeatpipe;
  const serverPerfCollectorFn =
    config.serverPerfCollectorFn || serverPerfCollector;

  if (!metrics) {
    return;
  }

  let data;

  try {
    data = adaptForHeatpipeFn(
      serverPerfCollectorFn(config)(req, metrics, route)
    );
  } catch (e) {
    // browser sent malformed data, don't try to publish
    return;
  }

  if (!data || typeof data !== 'object') {
    return;
  }

  publishFn(
    'web-performance',
    {topic: 'hp-unified_logging-web-performance', version: 20},
    data
  )
    .then(() =>
      console.log('Succesfully published performance metrics to heatpipe!')
    )
    .catch(err => {
      if (process.env['NODE_ENV'] !== 'development') {
        console.log(
          'Error publishing performance metrics to to heatpipe:',
          err
        );
      }
    });
}
