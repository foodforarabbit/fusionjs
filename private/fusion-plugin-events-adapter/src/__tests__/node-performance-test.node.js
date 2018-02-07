// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';
import perf from '../handlers/node-performance';

tape('node performance rss', gaugeTest('rss', 'rss'));
tape('node performance rss', gaugeTest('externalMemory', 'external_memory'));
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

    const mockM3 = {
      gauge(key, value) {
        t.equal(key, expectKey);
        t.equal(value, 10);
        t.end();
      },
    };

    perf({events, m3: mockM3});
    events.emit(`node-performance-emitter:gauge:${emitKey}`, 10);
  };
}

tape('node performance gc timing', t => {
  const events = new EventEmitter();

  const mockM3 = {
    timing(key, value, tags) {
      t.equal(key, 'gc');
      t.equal(value, 5);
      t.deepLooseEqual(tags, {gctype: 'test'});
      t.end();
    },
  };

  perf({events, m3: mockM3});
  events.emit('node-performance-emitter:timing:gc', {
    duration: 5,
    type: 'test',
  });
});
