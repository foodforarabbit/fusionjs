// @flow
import EventEmitter from './custom-event-emitter.js';

import HeatpipeEmitter, {webTopicInfo} from '../emitters/heatpipe-emitter';

import pageViewBrowser from '../handlers/page-view-browser';

test('page-view-browser handler', done => {
  const events = new EventEmitter();
  const mockHeatpipe = {
    asyncPublish(topicInfo, message) {
      expect({topicInfo, message}).toEqual({
        topicInfo: webTopicInfo,
        message: {
          app_name: 'test',
          app_runtime: 'development',
          type: 'view',
          name: 'ttt',
          page: 'ppp',
        },
      });
      done();
      return Promise.resolve();
    },
  };
  // $FlowFixMe
  const heatpipeEmitter = HeatpipeEmitter({
    heatpipe: mockHeatpipe,
    serviceName: 'test',
    runtime: 'development',
  });

  pageViewBrowser({events, heatpipeEmitter});

  events.emit('pageview:browser', {page: 'ppp', title: 'ttt'});
});
