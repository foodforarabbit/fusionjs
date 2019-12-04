// @flow
import EventEmitter from './custom-event-emitter.js';
import tape from 'tape-cup';

import HeatpipeEmitter, {webTopicInfo} from '../emitters/heatpipe-emitter';

import customEvent from '../handlers/custom-event';

tape('custom-event handler', t => {
  t.plan(4);
  const events = new EventEmitter();
  const ctx = {};
  const payload = {
    name: 'ORDER_HISTORY_LOAD_FAILED',
    type: 'impression',
    value: 'timeout',
    _trackingMeta: {
      testString: 'str',
      testLong: 64,
      testBool: false,
    },
    webEventsMeta: {
      time_ms: 1000,
    },
  };

  const m3 = {
    increment(key, tags) {
      t.equal(key, 'custom_web_event');
      t.deepLooseEqual(tags, {event_name: payload.name});
      t.pass('m3 incremented');
    },
  };

  const mockHeatpipe = {
    asyncPublish(topicInfo, message) {
      t.deepEqual(
        {topicInfo, message},
        {
          topicInfo: webTopicInfo,
          message: {
            ...message,
            name: payload.name,
            type: payload.type,
            value: payload.value,
            meta: {testString: payload._trackingMeta.testString},
            meta_long: {testLong: payload._trackingMeta.testLong},
            meta_bool: {testBool: payload._trackingMeta.testBool},
            time_ms: 1000,
          },
        },
        `Heatpipe event published`
      );
      return Promise.resolve();
    },
  };

  const mockAnalyticsSession = {
    from: () => false,
  };

  // $FlowFixMe
  const heatpipeEmitter = HeatpipeEmitter({
    AnalyticsSession: mockAnalyticsSession,
    heatpipe: mockHeatpipe,
    serviceName: 'test',
  });

  customEvent({events, heatpipeEmitter, m3});

  events.emit('custom-hp-web-event', payload, ctx);
  t.end();
});
