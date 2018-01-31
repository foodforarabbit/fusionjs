/* global console */
/* eslint-disable no-console */

import request from 'request';
import {createPlugin, createToken} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
export const HeatpipePerfLoggerConfig = createToken('HeatpipePerfLoggerConfig');
export default __NODE__ && createPlugin({
  deps: { emitter: UniversalEventsToken, config: HeatpipePerfLoggerConfig },
  provides: deps => {
    const emitter = deps.emitter;
    const config = deps.config;
    emitter.on('browser-performance-emitter:stats', e => {
      console.log('*****************', e);
      request.post('https://web-logging.uber.com/perf',{
          json: mapPerformanceDataToSchema(e)
      }, (err, resp) => {
        if (err) {
          console.log('Error publishing performance metrics to to heatpipe:', err);
        } else {
          if (resp.statusCode === 204) {
            console.log('Succesfully published performance metrics to heatpipe!');
          } else {
            console.log('Unexpected response while publishing performance metrics to to heatpipe:', resp.statusCode, resp.body);
          }
        }
      });
    });
  }
});

    // module.exports = ({EventEmitter, config}) => {
    //   if (__NODE__) {
    // if (!EventEmitter) {
    //   throw new Error(`EventEmitter is required, but was: ${EventEmitter}`);
    // }

    // const emitter = EventEmitter.of();
    // emitter.on('browser-performance-emitter:stats', (event, ctx) => {
    //   request.post('https://m2a.uber.com/perf',{
    //       json: mapPerformanceDataToSchema(event)
    //     }, (err, resp) => {
    //       if (err) {
    //         console.log('Error publishing performance metrics to to heatpipe:', err);
    //       } else {
    //         if (resp.statusCode === 204) {
    //           console.log('Succesfully published performance metrics to heatpipe!');
    //         } else {
    //           console.log('Unexpected response while publishing performance metrics to to heatpipe:', resp.statusCode, resp.body);
    //         }
    //       }
    //     });
    // });
  // }
// };

function mapPerformanceDataToSchema(event) {
    debugger;
    const {navigation, resources: resourcesRaw, network: rawNetwork, memory, firstPaint, tags, appId} = event;

    // const [url, qs] = tags.url ? tags.url.split('?') : [];
    const navigationMeta = {
      //   url,
      //   qs
    };

    const app = {
      name: appId,
      external: true,
    };

    navigation.redirectDuration = navigation.responseEnd - navigation.redirectStart;

    const resources = resourcesRaw.map(resource => {
      resource.initiator = resource.initiatorType;
      resource.resourceSize = resource.decodedBodySize;
      const {domComplete, fetchStart, resourceSize, transferSize} = resource;
      resource.redirectDuration = resource.responseEnd - resource.redirectStart;
      resource.duration = resource.responseEnd - resource.fetchStart;
      // find a better way to do this...
      resource.fromCache = resourceSize / transferSize > 2;
      return resource;
    });

    const network = {
      // region,
      // country,
      ...rawNetwork,
    };

    const client = {
      // locale,
      // device,
      // browser,
      memory,
      // serviceWorker,
    };

    const server = {};

    const result = {
      navigationMeta,
      network,
      app,
      timings: {navigation, resources},
      client,
      server,
    };

    return result;
  }