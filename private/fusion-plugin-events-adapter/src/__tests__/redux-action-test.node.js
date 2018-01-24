// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';

import M3 from '../emitters/m3';
import Heatpipe, {webTopicInfo} from '../emitters/heatpipe';

import reactAction from '../handlers/redux-action';

tape('redux-action handler', t => {
  const events = new EventEmitter();
  // $FlowFixMe
  const heatpipe = Heatpipe({events, service: 'test'});
  const m3 = M3(events);

  reactAction(events, heatpipe, m3);
  let emittedHp = false;
  let emittedIncrement = false;
  events.on('heatpipe:publish', payload => {
    emittedHp = true;
    t.deepEqual(
      payload,
      {
        topicInfo: webTopicInfo,
        message: {
          type: 'action',
          name: 'foo',
        },
      },
      `Heatpipe event published`
    );
  });

  events.on('m3:increment', payload => {
    emittedIncrement = true;
    t.equal(payload.key, 'action');
    t.deepLooseEqual(payload.tags, {action_type: 'foo'});
  });

  events.emit('redux-action-emitter:action', {type: 'foo'});
  t.ok(emittedHp, 'emits heatpipe event');
  t.ok(emittedIncrement, 'emits increment event');
  t.end();
});
