/* eslint-env node */
import M3Client from '@uber/node-m3-client-addon';
import {Plugin} from '@uber/graphene-plugin';

export default function({UniversalEvents, m3Config, __m3Mock}) {
  const m3 = __m3Mock || new M3Client(m3Config);
  const events = UniversalEvents.of();

  const m3Functions = {
    counter: ({key, value, tags}) => m3.counter(key, value, tags),
    increment: ({key, tags}) => m3.increment(key, 1, {tags}),
    decrement: ({key, tags}) => m3.decrement(key, 1, {tags}),
    timing: ({key, value, tags}) => m3.timing(key, value, {tags}),
    gauge: ({key, value, tags}) => m3.gauge(key, value, {tags}),
  };

  for (const funcName in m3Functions) {
    events.on(`m3:${funcName}`, m3Functions[funcName]);
  }

  class M3ServerPlugin extends Plugin {
    static of() {
      return super.of();
    }
  }

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

  return M3ServerPlugin;
}
