// @flow
import type {M3} from '../emitters/m3';
export default function nodePerformance(events: EventEmitter, m3: M3) {
  const prefix = 'node-performance-emitter';
  const gaugePrefix = `${prefix}:gauge`;
  // $FlowFixMe
  const gaugeWithType = key => value => m3.gauge({key, value});
  events.on(`${gaugePrefix}:rss`, gaugeWithType('rss'));
  events.on(`${gaugePrefix}:heapTotal`, gaugeWithType('heaptotal'));
  events.on(`${gaugePrefix}:heapUsed`, gaugeWithType('heapused'));
  events.on(`${gaugePrefix}:event_loop_lag`, gaugeWithType('event_loop_lag'));
  events.on(
    `${gaugePrefix}:globalAgentSockets`,
    gaugeWithType('globalagentsockets')
  );
  events.on(
    `${gaugePrefix}:globalAgentRequests`,
    gaugeWithType('globalagentrequests')
  );
  events.on(
    `${gaugePrefix}:globalAgentFreeSockets`,
    gaugeWithType('globalagentfreesockets')
  );
  events.on(`${prefix}:timing:gc`, ({duration, type}) => {
    m3.timing({key: 'gc', value: duration, tags: {gctype: type}});
  });
}
