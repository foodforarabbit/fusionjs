/* eslint-env node */
import assert from 'assert';
import M3Client from '@uber/node-m3-client-addon';
import {SingletonPlugin} from 'fusion-core';

export default function({
  UniversalEvents,
  service,
  Client = M3Client,
  commonTags,
}) {
  assert.equal(typeof service, 'string', '{service} parameter is required');
  assert.ok(UniversalEvents, '{UniversalEvents} parameter is required');
  const m3 = new Client({
    commonTags: Object.assign(
      {
        dc: process.env.UBER_DATACENTER || 'local',
        deployment: process.env.UDEPLOY_DEPLOYMENT_NAME || 'production',
        env: process.env.NODE_ENV || 'production',
        service,
        scaffolded_web_app: true, // eslint-disable-line camelcase
      },
      commonTags
    ),
  });
  const events = UniversalEvents.of();
  const makeValueHandler = original => ({key, value, tags}) =>
    original(key, value, {tags});
  const makeIncrementHandler = original => ({key, tags}) =>
    original(key, 1, {tags});
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
    timing: makeValueHandler(boundM3.counter),
    gauge: makeValueHandler(boundM3.counter),
  };

  for (const funcName in m3Handlers) {
    events.on(`m3:${funcName}`, m3Handlers[funcName]);
  }

  function M3ServerPlugin() {}
  Object.assign(M3ServerPlugin.prototype, {
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
  });

  return new SingletonPlugin({Service: M3ServerPlugin});
}
