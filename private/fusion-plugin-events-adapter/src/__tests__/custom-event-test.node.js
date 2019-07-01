// @flow
import EventEmitter from './custom-event-emitter.js';
import tape from 'tape-cup';

import HeatpipeEmitter, {webTopicInfo} from '../emitters/heatpipe-emitter';

import customEvent from '../handlers/custom-event';

tape('custom-event handler', t => {
  t.plan(4);
  const events = new EventEmitter();
  const payload = {
    name: 'ORDER_HISTORY_LOAD_FAILED',
    type: 'impression',
    value: 'timeout',
    _trackingMeta: {
      testString: 'str',
      testLong: 64,
      testBool: false,
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
          },
        },
        `Heatpipe event published`
      );
      return Promise.resolve();
    },
  };

  // $FlowFixMe
  const heatpipeEmitter = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    service: 'test',
  });

  customEvent({events, heatpipeEmitter, m3});

  events.emit('custom-hp-web-event', payload);
  t.end();
});
