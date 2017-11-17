// @flow
import tape from 'tape-cup';
import perf from '../../handlers/node-performance';
import M3 from '../../emitters/m3';
import EventEmitter from 'events';

tape('node performance rss', gaugeTest('rss', 'rss'));
tape('node performance heapTotal', gaugeTest('heapTotal', 'heaptotal'));
tape('node performance heapUsed', gaugeTest('heapUsed', 'heapused'));
tape(
  'node performance event_loop_lag',
  gaugeTest('event_loop_lag', 'event_loop_lag')
);
tape(
  'node performance globalAgentSockets',
  gaugeTest('globalAgentSockets', 'globalagentsockets')
);
tape(
  'node performance globalAgentRequests',
  gaugeTest('globalAgentRequests', 'globalagentrequests')
);
tape(
  'node performance globalAgentFreeSockets',
  gaugeTest('globalAgentFreeSockets', 'globalagentfreesockets')
);

function gaugeTest(emitKey, expectKey) {
  return t => {
    const events = new EventEmitter();
    const m3 = M3(events);
    perf(events, m3);
    events.on('m3:gauge', ({key, value}) => {
      t.equal(key, expectKey);
      t.equal(value, 10);
      t.end();
    });
    events.emit(`node-performance-emitter:gauge:${emitKey}`, 10);
  };
}

tape('node performance gc timing', t => {
  const events = new EventEmitter();
  const m3 = M3(events);
  perf(events, m3);
  events.on('m3:timing', payload => {
    t.equal(payload.key, 'gc');
    t.equal(payload.value, 5);
    t.deepLooseEqual(payload.tags, {gctype: 'test'});
    t.end();
  });
  events.emit('node-performance-emitter:timing:gc', {
    duration: 5,
    type: 'test',
  });
});
