// @flow
/* eslint-env node */
import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import tape from 'tape-cup';

import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import {
  HeatpipeToken,
  HeatpipeConfigToken,
  HeatpipeClientToken,
} from '../tokens';
import HeatpipePlugin from '../server';

import {mock} from './mock';
import HeatpipePublisher from '@uber/node-heatpipe-publisher';

const {test} = tape;

test('heatpipe-plugin in __DEV__', async t => {
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
  app.register(M3Token, {});
  // $FlowFixMe
  app.register(UniversalEventsToken, events);
  app.register(
    createPlugin({
      deps: {
        heatpipe: HeatpipeToken,
      },
      provides: ({heatpipe}) => {
        t.doesNotThrow(heatpipe.publish, 'publish does not throw');
        t.doesNotThrow(() => {
          heatpipe.publish({topic: 'foo', version: 1}, {bar: 'baz'});
        }, 'publish does not throw');
        t.doesNotThrow(heatpipe.destroy, 'destroy does not throw');
        heatpipe
          .asyncPublish({topic: 'foo', version: 43}, {msg: 'thing'})
          .then(() => {
            t.pass('asyncPublish works');
          })
          .catch(t.ifError)
          .then(() => t.end());
      },
    })
  );
  getSimulator(app);
});

test('heatpipe-plugin, successful publish', async t => {
  const {app, MockHeatpipeClient} = bootstrapTest();
  getSimulator(
    app,
    createPlugin({
      deps: {
        api: HeatpipeToken,
      },
      provides({api}) {
        // successful heatpipe.publish() returns undefined when complete
        MockHeatpipeClient.mock.instances[0].publish.mockImplementation(
          (topicInfo, message, cb) => undefined
        );
        const topicInfo = {topic: 'awesome-topic', version: 99};
        const message = {hello: 'world'};

        // test api.publish
        const result = api.publish(topicInfo, message);
        t.equals(result, undefined, 'publish successful!');

        // test api.asyncPublish
        api
          .asyncPublish(topicInfo, message)
          .then(() => t.pass('asyncPublish successful!'));

        // checks argument forwarding to underlying client
        const [
          _topicInfo,
          _message,
          _callback,
        ] = MockHeatpipeClient.mock.instances[0].publish.mock.calls[0];

        t.deepEqual(
          topicInfo,
          _topicInfo,
          'topicInfo passed through to heatpipe.publish'
        );

        t.deepEqual(
          message,
          _message,
          'message passed through to heatpipe.publish'
        );

        t.equals(
          'function',
          typeof _callback,
          'callback passed through to heatpipe.publish'
        );
      },
    })
  );
  t.end();
});

test('heatpipe-plugin, unsuccessful publish', async t => {
  const {app, MockHeatpipeClient} = bootstrapTest();
  getSimulator(
    app,
    createPlugin({
      deps: {
        api: HeatpipeToken,
      },
      provides({api}) {
        const error = new Error('HeatpipeClient message queue is oversized');
        // a failed heatpipe.publish() returns cb(errorObject)
        MockHeatpipeClient.mock.instances[0].publish.mockImplementation(
          (topicInfo, message, cb) => cb(error)
        );
        const topicInfo = {topic: 'awesome-topic', version: 99};
        const message = {hello: 'world'};
        const failureTypeA = api.publish(topicInfo, message);
        t.deepEquals(
          failureTypeA,
          error,
          'unsuccessful publish should return an error object'
        );

        // another type of failed publish invokes cb(error), but returns undefined!!!
        MockHeatpipeClient.mock.instances[0].publish.mockImplementation(
          (topicInfo, message, cb) => {
            cb(error);
            return;
          }
        );
        const failureTypeB = api.publish(topicInfo, message);
        t.deepEquals(
          failureTypeB,
          error,
          'unsuccessful publish should return an error object'
        );

        // test api.asyncPublish
        api
          .asyncPublish(topicInfo, message)
          .catch(err =>
            t.deepEquals(error, err, 'asyncPublish rejects with error')
          );

        // checks argument forwarding to underlying client
        const [
          _topicInfo,
          _message,
          _callback,
        ] = MockHeatpipeClient.mock.instances[0].publish.mock.calls[0];

        t.deepEqual(
          topicInfo,
          _topicInfo,
          'topicInfo passed through to heatpipe.publish'
        );

        t.deepEqual(
          message,
          _message,
          'message passed through to heatpipe.publish'
        );

        t.equals(
          'function',
          typeof _callback,
          'callback passed through to heatpipe.publish'
        );
      },
    })
  );
  t.end();
});

test('heatpipe-plugin destroy', async t => {
  const {app, MockHeatpipeClient} = bootstrapTest();
  getSimulator(
    app,
    createPlugin({
      deps: {
        api: HeatpipeToken,
      },
      provides({api}) {
        let called = {
          a: false,
          b: false,
        };

        MockHeatpipeClient.mock.instances[0].destroy.mockImplementation(cb =>
          cb()
        );

        // test api.destroy
        api.destroy(() => {
          called.a = true;
        });

        t.ok(called.a, 'post-destroy callback was called');

        // destroy callback not called
        MockHeatpipeClient.mock.instances[0].destroy.mockImplementation(cb => {
          return;
        });

        // test api.destroy
        api.destroy(() => {
          called.b = true;
        });

        t.ok(
          called.b,
          'post-destroy callback was called, even when client.destroy(cb) not called'
        );
      },
    })
  );
  t.end();
});

function bootstrapTest() {
  const events = {
    on(type) {},
  };
  const mockM3 = {};
  const mockLogger = {};
  const MockHeatpipeClient = mock(HeatpipePublisher);

  const app = new App('content', el => el);
  app.register(HeatpipeToken, HeatpipePlugin);
  app.register(HeatpipeConfigToken, {foo: 'bar'});
  app.register(HeatpipeClientToken, MockHeatpipeClient);
  // $FlowFixMe
  app.register(LoggerToken, mockLogger);
  // $FlowFixMe
  app.register(M3Token, mockM3);
  // $FlowFixMe
  app.register(UniversalEventsToken, events);
  return {app, MockHeatpipeClient};
}
