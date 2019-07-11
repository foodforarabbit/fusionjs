// @flow
/* global process */
/* eslint-disable no-console,no-process-env */

import type {
  HeatpipePerformanceLoggerDepsType,
  HeatpipePerformanceLoggerType,
} from './types';

import request from 'request';
import {createPlugin} from 'fusion-core';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

export default __NODE__ &&
  createPlugin<
    HeatpipePerformanceLoggerDepsType,
    HeatpipePerformanceLoggerType
  >({
    deps: {emitter: UniversalEventsToken},
    provides: deps => {
      const emitter = deps.emitter;
      emitter.on('browser-performance-emitter:stats', (e, ctx) => {
        request.post(
          'https://web-logging.uber.com/perf',
          {
            json: mapPerformanceDataToSchema(e, ctx),
          },
          (err, resp) => {
            if (err) {
              console.log(
                'Error publishing performance metrics to to heatpipe:',
                err
              );
            } else {
              if (resp.statusCode === 204) {
                console.log(
                  'Succesfully published performance metrics to heatpipe!'
                );
              } else {
                console.log(
                  'Unexpected response while publishing performance metrics to to heatpipe:',
                  resp.statusCode,
                  resp.body
                );
              }
            }
          }
        );
      });
    },
  });

function mapPerformanceDataToSchema(event, ctx) {
  const {
    navigation,
    resources: resourcesRaw,
    network: rawNetwork,
    memory,
    appId,
    external,
  } = event;
  const navigationMeta = {
    // $FlowFixMe
    url: ctx.url,
    // $FlowFixMe
    qs: ctx.querystring,
  };

  const app = {
    name: appId,
    external: external || false,
  };

  navigation.redirectDuration =
    navigation.responseEnd - navigation.redirectStart;

  const resources = resourcesRaw.map(resource => {
    resource.initiator = resource.initiatorType;
    resource.resourceSize = resource.decodedBodySize;
    const {resourceSize, transferSize} = resource;
    resource.redirectDuration = resource.responseEnd - resource.redirectStart;
    resource.duration = resource.responseEnd - resource.fetchStart;
    // find a better way to do this...
    resource.fromCache = resourceSize / transferSize > 2;
    return resource;
  });

  const network = {
    ...rawNetwork,
    // $FlowFixMe
    ipAddress: (ctx.request && ctx.request.ip) || ctx.ip,
  };

  const client = {
    memory,
    // $FlowFixMe
    ua: ctx.request && ctx.request.headers['user-agent'],
    locale: 'en',
  };

  const server = {
    node: process.version,
    env: process.env.UBER_RUNTIME_ENVIRONMENT || process.env.NODE_ENV,
    dc: process.env.UBER_DATACENTER,
    host: process.env.HOSTNAME,
    build: process.env.GIT_DESCRIBE,
  };

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
