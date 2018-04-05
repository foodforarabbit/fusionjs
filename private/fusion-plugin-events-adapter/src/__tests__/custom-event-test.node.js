// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';

import HeatpipeEmitter, {webTopicInfo} from '../emitters/heatpipe-emitter';

import customEvent from '../handlers/custom-event';

tape('custom-event handler', t => {
  t.plan(4);
  const events = new EventEmitter();
  const message = {
    name: 'ORDER_HISTORY_LOAD_FAILED',
    type: 'impression',
    value: 'timeout',
  };

  const m3 = {
    increment(key, tags) {
      t.equal(key, 'custom_web_event');
      t.deepLooseEqual(tags, {event_name: message.name});
      t.pass('m3 incremented');
    },
  };

  const mockHeatpipe = {
    publish(topicInfo, message) {
      t.deepEqual(
        {topicInfo, message},
        {
          topicInfo: webTopicInfo,
          message,
        },
        `Heatpipe event published`
      );
    },
  };

  // $FlowFixMe
  const heatpipeEmitter = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    service: 'test',
  });

  customEvent({events, heatpipeEmitter, m3});

  events.emit('custom-hp-web-event', message);
  t.end();
});
