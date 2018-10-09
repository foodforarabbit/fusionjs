// @noflow
/* global process */
/* eslint-disable no-console */

import request from 'request';
import {serverPerfCollector} from '@uber/web-perf-collector';

export default function postToCatalyst(
  {enhancedMetrics: metrics},
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
  // TODO: remove console.logs when testing phase complete
  // https://github.com/uber-web/web-platform-tasks/issues/679
  request.post(
    'https://web-logging.uber.com/perf',
    {
      json: {
        ...serverPerfCollector(config)(req, metrics),
      },
    },
    (err, resp) => {
      if (err) {
        console.log(
          'Error publishing performance metrics to to heatpipe:',
          err
        );
      } else if (resp.statusCode === 204) {
        console.log('Succesfully published performance metrics to heatpipe!');
      } else {
        console.log(
          'Unexpected response while publishing performance metrics to to heatpipe:',
          resp.statusCode,
          resp.body
        );
      }
    }
  );
}
