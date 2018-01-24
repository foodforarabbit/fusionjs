// @flow
import EventEmitter from 'events';
import tape from 'tape-cup';

import pageViewBrowser from '../handlers/page-view-browser';

tape('[Browser] page-view-browser handler', t => {
  const events = new EventEmitter();
  const mockAnalytics = {
    pageview: data => {
      t.deepEqual(data, {page: 'ppp', title: 'ttt'});
    },
  };

  pageViewBrowser({events, analytics: mockAnalytics});
  events.emit('pageview:browser', {page: 'ppp', title: 'ttt'});

  t.end();
});
