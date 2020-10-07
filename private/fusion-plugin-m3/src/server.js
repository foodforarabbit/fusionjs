// @flow
/* eslint-env node */
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {createPlugin} from 'fusion-core';

import {
  M3ClientToken,
  CommonTagsToken,
  HistogramOptionsToken,
} from './tokens.js';

import type {FusionPlugin} from 'fusion-core';
import type {M3Type, M3DepsType, ServiceType} from './types.js';
import M3Client from '@uber/m3-client';

const logM3ClientParams = (type, key, value, tags) => {
  if (__DEV__ && process.env.DEBUG_M3) {
    try {
      //eslint-disable-next-line
      console.log(
        `[m3] ${type} - ${key} - ${value} - ${JSON.stringify(tags)}`
      );
    } catch (e) {
      //eslint-disable-next-line
      console.log(
        `[m3] ${type} - ${key} - ${value} - unable to serialize tags`
      );
    }
  }
};

const plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
      Client: M3ClientToken.optional,
      commonTags: CommonTagsToken.optional,
      histogramOptions: HistogramOptionsToken.optional,
    },
    provides: ({events, Client, commonTags, histogramOptions}) => {
      Client = ((Client || M3Client: any): M3Type);
      const service = __DEV__ ? 'dev-service' : process.env.SVC_ID;
      const m3 = new Client({
        commonTags: Object.assign(
          {
            dc: process.env.UBER_DATACENTER || 'local',
            deployment: process.env.UDEPLOY_DEPLOYMENT_NAME || 'production',
            env: process.env.NODE_ENV || 'production',
            runtime: process.env.UBER_RUNTIME_ENVIRONMENT || 'production',
            service: service,
            framework: 'fusion',
            scaffolded_web_app: true, // eslint-disable-line camelcase
          },
          commonTags
        ),
        histogramOptions,
      });
      const makeValueHandler = original => ({
        key,
        value,
        tags = {},
        __url__,
      }) => {
        if (__url__) {
          Object.assign(tags, {route: __url__});
        }
        logM3ClientParams('value', key, value, {tags});
        return original(key, value, {tags});
      };
      const makeIncrementHandler = original => ({key, tags = {}, __url__}) => {
        if (__url__) {
          Object.assign(tags, {route: __url__});
        }
        logM3ClientParams('increment', key, 1, {tags});
        return original(key, 1, {tags});
      };
      const makeValueFunction = original => (key, value, tags) => {
        logM3ClientParams('value', key, value, {tags});
        return original(key, value, {tags});
      };
      const makeIncrementFunction = original => (key, tags) => {
        logM3ClientParams('increment', key, 1, {tags});
        return original(key, 1, {tags});
      };

      const boundM3 = {
        scope: m3.scope.bind(m3),
        close: m3.close.bind(m3),
        counter: m3.counter.bind(m3),
        histogram: m3.histogram.bind(m3),
        increment: m3.increment.bind(m3),
        decrement: m3.decrement.bind(m3),
        timing: m3.timing.bind(m3),
        gauge: m3.gauge.bind(m3),
        immediateCounter: m3.immediateCounter.bind(m3),
        immediateHistogram: m3.immediateHistogram.bind(m3),
        immediateIncrement: m3.immediateIncrement.bind(m3),
        immediateDecrement: m3.immediateDecrement.bind(m3),
        immediateTiming: m3.immediateTiming.bind(m3),
        immediateGauge: m3.immediateGauge.bind(m3),
      };

      const m3Handlers = {
        counter: makeValueHandler(boundM3.counter),
        histogram: makeValueHandler(boundM3.histogram),
        increment: makeIncrementHandler(boundM3.increment),
        decrement: makeIncrementHandler(boundM3.decrement),
        timing: makeValueHandler(boundM3.timing),
        gauge: makeValueHandler(boundM3.gauge),
      };

      for (const funcName in m3Handlers) {
        events.on(`m3:${funcName}`, m3Handlers[funcName]);
      }
      return {
        scope: boundM3.scope,
        close: boundM3.close,
        counter: makeValueFunction(boundM3.counter),
        histogram: makeValueFunction(boundM3.histogram),
        increment: makeIncrementFunction(boundM3.increment),
        decrement: makeIncrementFunction(boundM3.decrement),
        timing: makeValueFunction(boundM3.timing),
        gauge: makeValueFunction(boundM3.gauge),
        immediateCounter: makeValueFunction(boundM3.immediateCounter),
        immediateHistogram: makeValueFunction(boundM3.immediateHistogram),
        immediateIncrement: makeIncrementFunction(boundM3.immediateIncrement),
        immediateDecrement: makeIncrementFunction(boundM3.immediateDecrement),
        immediateTiming: makeValueFunction(boundM3.immediateTiming),
        immediateGauge: makeValueFunction(boundM3.immediateGauge),
      };
    },
    cleanup: m3 => m3.close(),
  });

export default ((plugin: any): FusionPlugin<M3DepsType, ServiceType>);
