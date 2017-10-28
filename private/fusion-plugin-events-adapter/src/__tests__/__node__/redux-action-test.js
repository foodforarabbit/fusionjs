import EventEmitter from 'events';
import tape from 'tape-cup';

import Heatpipe, {webTopicInfo} from '../../emitters/heatpipe';

import reactAction from '../../handlers/redux-action';

tape('redux-action handler', t => {
  const events = new EventEmitter();
  const heatpipe = Heatpipe({events});

  reactAction({events, heatpipe});

  events.on('heatpipe:publish', payload => {
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
    t.end();
  });

  events.emit('redux-action-emitter:action', {type: 'foo'});
});
