// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';

import HeatpipeEmitter, {webTopicInfo} from '../emitters/heatpipe-emitter';

import reactAction from '../handlers/redux-action';

tape('redux-action handler', t => {
  const events = new EventEmitter();

  const mockM3 = {
    increment(key, tags) {
      t.equal(key, 'action');
      t.deepLooseEqual(tags, {action_type: 'foo'});
      t.pass('m3 incremented');
    },
  };

  const mockHeatpipe = {
    publish(topicInfo, message) {
      t.deepEqual(
        {topicInfo, message},
        {
          topicInfo: webTopicInfo,
          message: {
            type: 'action',
            name: 'foo',
          },
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

  reactAction({events, heatpipeEmitter, m3: mockM3});

  events.emit('redux-action-emitter:action', {type: 'foo'});
  t.end();
});
