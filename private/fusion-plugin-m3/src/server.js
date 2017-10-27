/* eslint-env node */
import M3Client from '@uber/node-m3-client-addon';
import {SingletonPlugin} from '@uber/graphene-plugin';

export default function({UniversalEvents, m3Config, Client = M3Client}) {
  const m3 = new Client(m3Config);
  const events = UniversalEvents.of();

  const m3Functions = {
    counter: ({key, value, tags}) => m3.counter(key, value, {tags}),
    increment: ({key, tags}) => m3.increment(key, 1, {tags}),
    decrement: ({key, tags}) => m3.decrement(key, 1, {tags}),
    timing: ({key, value, tags}) => m3.timing(key, value, {tags}),
    gauge: ({key, value, tags}) => m3.gauge(key, value, {tags}),
  };

  for (const funcName in m3Functions) {
    events.on(`m3:${funcName}`, m3Functions[funcName]);
  }

  function M3ServerPlugin() {}

  M3ServerPlugin.prototype.counter = (key, value, tags) =>
    m3Functions.counter({key, value, tags});

  M3ServerPlugin.prototype.increment = (key, tags) =>
    m3Functions.increment({key, tags});

  M3ServerPlugin.prototype.decrement = (key, tags) =>
    m3Functions.decrement({key, tags});

  M3ServerPlugin.prototype.timing = (key, value, tags) =>
    m3Functions.timing({key, value, tags});

  M3ServerPlugin.prototype.gauge = (key, value, tags) =>
    m3Functions.gauge({key, value, tags});

  [
    'scope',
    'immediateIncrement',
    'immediateDecrement',
    'immediateTiming',
    'immediateGauge',
    'close',
  ].forEach(funcName => {
    M3ServerPlugin.prototype[funcName] = m3[funcName].bind(m3);
  });

  return new SingletonPlugin({Service: M3ServerPlugin});
}
