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
  if (!metrics) {
    return;
  }

  const data = adaptForHeatpipe(
    serverPerfCollector(config)(req, metrics, route)
  );

  if (!data || typeof data !== 'object') {
    return;
  }

  publish(
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
