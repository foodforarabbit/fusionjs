// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';

import Heatpipe, {webTopicInfo} from '../emitters/heatpipe';

import pageViewBrowser from '../handlers/page-view-browser';

tape('page-view-browser handler', t => {
  const events = new EventEmitter();
  // $FlowFixMe
  const heatpipe = Heatpipe({events, service: 'test'});

  pageViewBrowser({events, heatpipe});

  events.on('heatpipe:publish', payload => {
    t.deepEqual(
      payload,
      {
        topicInfo: webTopicInfo,
        message: {
          type: 'view',
          name: 'ttt',
          page: 'ppp',
        },
      },
      `Heatpipe event published`
    );
    t.end();
  });

  events.emit('pageview:browser', {page: 'ppp', title: 'ttt'});
});
