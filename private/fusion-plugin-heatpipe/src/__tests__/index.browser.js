// @flow
/* eslint-env browser */
import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import tape from 'tape-cup';

import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import HeatpipePlugin from '../browser';
import {HeatpipeToken} from '../tokens';

const fixture = {
  topicInfo: {
    topic: 'awesome-topic',
    version: 99,
  },
  message: {
    hello: 'world',
  },
};

tape('heatpipe:publish', t => {
  const MockUniversalEvents = {
    from() {
      return this;
    },
    emit(type, {topicInfo, message}) {
      t.equal(type, 'heatpipe:publish', 'calls with correct event type');
      t.equal(topicInfo, fixture.topicInfo, 'topicInfo passes through');
      t.equal(message, fixture.message, 'message passes through');
      t.end();
    },
  };

  const app = new App('content', el => el);
  app.register(HeatpipeToken, HeatpipePlugin);
  // $FlowFixMe
  app.register(UniversalEventsToken, MockUniversalEvents);

  getSimulator(
    app,
    createPlugin({
      deps: {
        heatpipe: HeatpipeToken,
      },
      provides({heatpipe}) {
        heatpipe.publish(fixture.topicInfo, fixture.message);
      },
    })
  );
});
