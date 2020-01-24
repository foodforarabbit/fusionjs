// @flow
/* eslint-env browser */
import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

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

test('heatpipe:publish', done => {
  const MockUniversalEvents = {
    emit(type, {topicInfo, message}) {
      expect(type).toBe('heatpipe:publish');
      expect(topicInfo).toBe(fixture.topicInfo);
      expect(message).toBe(fixture.message);
      done();
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
