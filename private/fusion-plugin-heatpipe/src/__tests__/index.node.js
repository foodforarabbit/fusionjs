// @flow
/* eslint-env node */
import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import tape from 'tape-cup';
import {FetchToken, LoggerToken} from 'fusion-tokens';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';
import {HeatpipeToken} from '../tokens';
import HeatpipePlugin, {getRequestOptions} from '../server';

const {test} = tape;

test('heatpipe-plugin, encodes request options', t => {
  const appId = 'foo-service';
  const topicInfo = {
    topic: 'foo-topic',
    version: 1,
  };
  const message = {
    foo: 'bar',
    age: 42,
  };
  const options = getRequestOptions(appId, topicInfo, message);
  t.deepEquals(
    options,
    {
      method: 'POST',
      headers: {
        'rpc-service': 'web-heatpipe',
        'rpc-procedure': 'com.uber.go.webheatpipe.WebHeatpipe::Publish',
        'rpc-caller': 'foo-service',
        'rpc-encoding': 'json',
        'context-ttl-ms': '5000',
      },
      body:
        '{"appId":"foo-service","topic":"foo-topic","version":1,"payload":"{\\"foo\\":\\"bar\\",\\"age\\":42}"}',
    },
    'should encode payload correctly'
  );
  t.end();
});

test('heatpipe-plugin no-op in __DEV__ mode', async t => {
  const events = {
    on(type) {
      t.equal(type, `heatpipe:publish`, 'adds event handler correctly');
    },
  };
  const app = new App('content', el => el);
  app.register(HeatpipeToken, HeatpipePlugin);
  // $FlowFixMe
  app.register(LoggerToken, {});
  // $FlowFixMe
  app.register(FetchToken, () => {});
  // $FlowFixMe
  app.register(UniversalEventsToken, events);
  app.register(
    createPlugin({
      deps: {
        heatpipe: HeatpipeToken,
      },
      provides: ({heatpipe}) => {
        heatpipe
          .asyncPublish({topic: 'foo', version: 1}, {hello: 'world'})
          .then(resp => {
            t.equal(resp, undefined, 'resolves with undefined in __DEV__ mode');
            t.end();
          });
      },
    })
  );
  getSimulator(app);
});
