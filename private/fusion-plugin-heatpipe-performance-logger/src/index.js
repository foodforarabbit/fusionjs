/* global console */
/* eslint-disable no-console */

import request from 'request';

module.exports = ({EventEmitter, config}) => {
  if (__NODE__) {
    if (!EventEmitter) {
      throw new Error(`EventEmitter is required, but was: ${EventEmitter}`);
    }

    const emitter = EventEmitter.of();
    emitter.on('browser-performance-emitter:stats', (event, ctx) => {
      request.post('https://m2a.uber.com/perf',{
          json: mapPerformanceDataToSchema(event)
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
};

function mapPerformanceDataToSchema(event) {

    const {navigation, resources: resourcesRaw, network: rawNetwork, memory, firstPaint, tags, appId} = event;

    navigation.redirectDuration = navigation.responseEnd - navigation.redirectStart;
    // TEMP: to ensure liberal data types in schema
    Object.keys(navigation)
      .filter(prop => typeof navigation[prop] === 'number')
      .forEach(prop => navigation[prop] = Math.floor(navigation[prop]) + 0.1);


    const resources = resourcesRaw.map(resource => {
      resource.originalName = resource.name; // TODO:
      resource.initiator = resource.initiatorType;
      resource.resourceSize = resource.decodedBodySize;
      const {domComplete, fetchStart, resourceSize, transferSize} = resource;
      resource.redirectDuration = resource.responseEnd - resource.redirectStart;
      resource.duration = resource.responseEnd - resource.fetchStart;
      // find a better way to do this...
      resource.fromCache = resourceSize / transferSize > 2;

      // TEMP: to ensure liberal data types in schema
      Object.keys(resource)
        .filter(prop => typeof resource[prop] === 'number')
        .forEach(prop => resource[prop] = Math.floor(resource[prop]) + 0.1);

      return resource;
    });

    const app = {
      name: appId,
      version: 2.1, // TODO
      external: true, // TODO
    };

    const context = {
      // const [url, qs] = tags.url ? tags.url.split('?') : [];
      url: 'https://browser-tests.com', // TODO
      qs: 'ts=45', // TODO
      referrer: 'lorem ipsum', // TODO
      type: 'lorem ipsum', // TODO
      loggedIn: false, // TODO
    };

    const network = {
      region: 'North America', // TODO
      country: 'Canada', // TODO
      ip: 462378647823, // TODO
      downlink: 4.25, // TODO
      effectiveType: "4g", // TODO
      rtt: 50, // TODO
      // ...rawNetwork,
    };

    const server = {
      build: '762', // TODO
      dc: 'SJC1', // TODO
      env: 'lorem ipsum', // TODO
      host: 'lorem ipsum', // TODO
      node_version: 123.45, // TODO
    };

    const client = {
      locale: 'en-CA', // TODO
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36', // TODO
      device: {
        manufacturer: 'Apple', // TODO
        model: 'iPhone', // TODO
        type: 'phone', // TODO
        osType: 'iOS', // TODO
        osVersion: '9.1', // TODO
      },
      browser: {
        manufacturer: 'Apple', // TODO
        name: 'Safari', // TODO
        version: '9.1.1', // TODO
        engine: 'WebKit', // TODO
        engineVersion: '531.21.10' // TODO
      },
      memory: {
        jsHeapSizeLimit: 2190000000, // TODO
        totalJSHeapSize: 72200000, // TODO
        usedJSHeapSize: 68000000, // TODO
      },
      serviceWorker: {
        supported: false, // TODO
        active: false, // TODO
      }
    };

    const result = {
      context,
      network,
      app,
      timings: {navigation, resources},
      client,
      server,
    };

    console.log('••••••', JSON.stringify(result, null, 2));

    return result;
  }