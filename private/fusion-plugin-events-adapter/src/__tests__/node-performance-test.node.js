// @flow
import EventEmitter from './custom-event-emitter.js';
import perf from '../handlers/node-performance';

test('node performance rss', gaugeTest('rss', 'rss'));
test(
  'node performance externalMemory',
  gaugeTest('externalMemory', 'external_memory')
);
test('node performance heapTotal', gaugeTest('heapTotal', 'heaptotal'));
test('node performance heapUsed', gaugeTest('heapUsed', 'heapused'));
test(
  'node performance event_loop_lag',
  gaugeTest('event_loop_lag', 'event_loop_lag')
);
test(
  'node performance globalAgentSockets',
  gaugeTest('globalAgentSockets', 'globalagentsockets')
);
test(
  'node performance globalAgentRequests',
  gaugeTest('globalAgentRequests', 'globalagentrequests')
);
test(
  'node performance globalAgentFreeSockets',
  gaugeTest('globalAgentFreeSockets', 'globalagentfreesockets')
);

function gaugeTest(emitKey, expectKey) {
  return done => {
    const events = new EventEmitter();

    const mockM3 = {
      gauge(key, value) {
        expect(key).toBe(expectKey);
        expect(value).toBe(10);
        done();
      },
    };

    perf({events, m3: mockM3});
    events.emit(`node-performance-emitter:gauge:${emitKey}`, 10);
  };
}

test('node performance gc timing', done => {
  const events = new EventEmitter();

  const mockM3 = {
    timing(key, value, tags) {
      expect(key).toBe('gc');
      expect(value).toBe(5);
      expect(tags).toStrictEqual({gctype: 'test'});
      done();
    },
  };

  perf({events, m3: mockM3});
  events.emit('node-performance-emitter:timing:gc', {
    duration: 5,
    type: 'test',
  });
});
