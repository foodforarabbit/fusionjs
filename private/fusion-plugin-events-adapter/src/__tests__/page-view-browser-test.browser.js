// @flow
import EventEmitter from './custom-event-emitter.js';

import pageViewBrowser from '../handlers/page-view-browser';

test('[Browser] page-view-browser handler', () => {
  const events = new EventEmitter();
  const mockAnalytics = {
    pageview: data => {
      expect(data).toEqual({page: 'ppp', title: 'ttt'});
    },
  };

  pageViewBrowser({events, analytics: mockAnalytics});
  events.emit('pageview:browser', {page: 'ppp', title: 'ttt'});
});
