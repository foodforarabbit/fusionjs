/* eslint-env browser */
import tape from 'tape-cup';
import HeatpipePlugin from '../../browser';

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
  const UniversalEvents = {
    of() {
      return {
        emit(type, {topicInfo, message}) {
          t.equal(type, 'heatpipe:publish', 'calls with correct event type');
          t.equal(topicInfo, fixture.topicInfo, 'topicInfo passes through');
          t.equal(message, fixture.message, 'message passes through');
          t.end();
        },
      };
    },
  };
  const heatpipe = HeatpipePlugin({UniversalEvents}).of();
  heatpipe.publish(fixture.topicInfo, fixture.message);
});
