/* eslint-env node */
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {createPlugin, createToken} from 'fusion-core';

export const M3ClientToken = createToken('M3Client');
export const CommonTagsToken = createToken('commonTags');

export default __NODE__ &&
  createPlugin({
    deps: {
      events: UniversalEventsToken,
      Client: M3ClientToken,
      commonTags: CommonTagsToken.optional,
    },
    provides: ({events, Client, commonTags}) => {
      Client = Client || require('@uber/node-m3-client-addon');
      const service = __DEV__ ? 'dev-service' : process.env.SVC_ID;
      const m3 = new Client({
        commonTags: Object.assign(
          {
            dc: process.env.UBER_DATACENTER || 'local',
            deployment: process.env.UDEPLOY_DEPLOYMENT_NAME || 'production',
            env: process.env.NODE_ENV || 'production',
            service: service,
            scaffolded_web_app: true, // eslint-disable-line camelcase
          },
          commonTags
        ),
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
        return original(key, value, {tags});
      };
      const makeIncrementHandler = original => ({key, tags = {}, __url__}) => {
        if (__url__) {
          Object.assign(tags, {route: __url__});
        }
        return original(key, 1, {tags});
      };
      const makeValueFunction = original => (key, value, tags) =>
        original(key, value, {tags});
      const makeIncrementFunction = original => (key, tags) =>
        original(key, 1, {tags});

      const boundM3 = {
        scope: m3.scope.bind(m3),
        close: m3.close.bind(m3),
        counter: m3.counter.bind(m3),
        increment: m3.increment.bind(m3),
        decrement: m3.decrement.bind(m3),
        timing: m3.timing.bind(m3),
        gauge: m3.gauge.bind(m3),
        immediateCounter: m3.immediateCounter.bind(m3),
        immediateIncrement: m3.immediateIncrement.bind(m3),
        immediateDecrement: m3.immediateDecrement.bind(m3),
        immediateTiming: m3.immediateTiming.bind(m3),
        immediateGauge: m3.immediateGauge.bind(m3),
      };

      const m3Handlers = {
        counter: makeValueHandler(boundM3.counter),
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
        increment: makeIncrementFunction(boundM3.increment),
        decrement: makeIncrementFunction(boundM3.decrement),
        timing: makeValueFunction(boundM3.timing),
        gauge: makeValueFunction(boundM3.gauge),
        immediateCounter: makeValueFunction(boundM3.immediateCounter),
        immediateIncrement: makeIncrementFunction(boundM3.immediateIncrement),
        immediateDecrement: makeIncrementFunction(boundM3.immediateDecrement),
        immediateTiming: makeValueFunction(boundM3.immediateTiming),
        immediateGauge: makeValueFunction(boundM3.immediateGauge),
      };
    },
  });
