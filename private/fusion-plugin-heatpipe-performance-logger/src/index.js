/* global console */
/* eslint-disable no-console */

import {createHeatpipePublisher, publishToHeatpipe} from '@uber/heatpipe-web-performance-logger';

module.exports = ({EventEmitter, config}) => {
  if (__NODE__) {
    if (!EventEmitter) {
      throw new Error(`EventEmitter is required, but was: ${EventEmitter}`);
    }

    const publisher = createHeatpipePublisher({
      error: console.log,
      info: console.log,
      debug: console.log
    },
      {
        increment: () => {}
      }, config);

    const emitter = EventEmitter.of();
    emitter.on('browser-performance-emitter:stats', (e, ctx) => {
      publishToHeatpipe(publisher, e);
    });
  }
};
