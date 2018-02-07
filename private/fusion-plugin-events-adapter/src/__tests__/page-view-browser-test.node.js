// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';

import HeatpipeEmitter, {webTopicInfo} from '../emitters/heatpipe-emitter';

import pageViewBrowser from '../handlers/page-view-browser';

tape('page-view-browser handler', t => {
  const events = new EventEmitter();
  const mockHeatpipe = {
    publish(topicInfo, message) {
      t.deepEqual(
        {topicInfo, message},
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
    },
  };
  // $FlowFixMe
  const heatpipeEmitter = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    serviceName: 'test',
  });

  pageViewBrowser({events, heatpipeEmitter});

  events.emit('pageview:browser', {page: 'ppp', title: 'ttt'});
});
