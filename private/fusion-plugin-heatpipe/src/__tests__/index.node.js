// @flow
/* eslint-env node */
import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import tape from 'tape-cup';

import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {UniversalEventsToken} from 'fusion-plugin-universal-events';

import {HeatpipeToken, HeatpipeConfigToken} from '../tokens';
import HeatpipePlugin, {HeatpipeClientToken} from '../server';

tape('heatpipe-plugin in __DEV__', async t => {
  const mockM3ServiceInstance = {};
  const mockLoggerServiceInstance = {};
  const app = new App('content', el => el);
  const events = {
    on(type) {
      t.equal(type, `heatpipe:publish`, 'adds event handler correctly');
    },
  };
  app.register(HeatpipeToken, HeatpipePlugin);
  // $FlowFixMe
  app.register(LoggerToken, mockLoggerServiceInstance);
  // $FlowFixMe
  app.register(M3Token, mockM3ServiceInstance);
  // $FlowFixMe
  app.register(UniversalEventsToken, events);
  app.register(
    createPlugin({
      deps: {
        hp: HeatpipeToken,
      },
      provides: ({hp}) => {
        t.doesNotThrow(hp.publish, 'publish does not throw');
        t.doesNotThrow(hp.destroy, 'destroy does not throw');
        hp.asyncPublish('data', 'thing')
          .then(() => t.pass('asyncPublish works'))
          .catch(t.ifError)
          .then(() => t.end());
      },
    })
  );
  getSimulator(app);
});

tape('[fusion] heatpipe-plugin', async t => {
  const fixture = {
    heatpipeConfig: {foo: 'bar'},
    topicInfo: {
      topic: 'awesome-topic',
      version: 99,
    },
    message: {
      hello: 'world',
    },
    error: {
      message: 'end of the world',
    },
  };

  const events = {
    on(type) {
      t.equal(type, `heatpipe:publish`, 'adds event handler correctly');
    },
  };

  const called = {connect: false, destroy: false};

  const mockM3ServiceInstance = {};
  const mockLoggerServiceInstance = {};

  class MockClient {
    constructor(configDep) {
      t.equal(
        configDep.foo,
        fixture.heatpipeConfig.foo,
        'passes config through'
      );
      t.equal(
        configDep.statsd,
        mockM3ServiceInstance,
        'passes M3 service to statsd'
      );
      t.equal(
        configDep.m3Client,
        mockM3ServiceInstance,
        'passes M3 service to m3Client'
      );
      t.equal(
        configDep.logger,
        mockLoggerServiceInstance,
        'passes Logger service'
      );
    }
    connect() {
      called.connect = true;
    }
    publish(topicInfo, message, cb) {
      t.equal(
        topicInfo,
        fixture.topicInfo,
        'HeatpipePublisher.publish() - topicInfo passes through'
      );
      t.equal(
        message,
        fixture.message,
        'HeatpipePublisher.publish() - message passes through'
      );
      if (cb) {
        cb(fixture.error);
      }
    }
    destroy() {
      called.destroy = true;
    }
  }

  const app = new App('content', el => el);
  app.register(HeatpipeToken, HeatpipePlugin);
  app.register(HeatpipeConfigToken, fixture.heatpipeConfig);
  app.register(HeatpipeClientToken, MockClient);
  // $FlowFixMe
  app.register(LoggerToken, mockLoggerServiceInstance);
  // $FlowFixMe
  app.register(M3Token, mockM3ServiceInstance);
  // $FlowFixMe
  app.register(UniversalEventsToken, events);

  getSimulator(
    app,
    createPlugin({
      deps: {
        heatpipe: HeatpipeToken,
      },
      provides({heatpipe}) {
        t.ok(
          called.connect,
          'HeatpipePublisher.connect() - invoked upon service instantiation'
        );

        heatpipe.asyncPublish(fixture.topicInfo, fixture.message).catch(err => {
          t.equal(
            err,
            fixture.error,
            'service instance asyncPublish() - throws error'
          );
        });

        heatpipe.publish(fixture.topicInfo, fixture.message, err => {
          t.equal(
            err,
            fixture.error,
            'service instance publish() - throws error'
          );
        });

        heatpipe.destroy();

        t.ok(
          called.destroy,
          'HeatpipePublisher.destroy() - invoked upon service instance destroy'
        );
      },
    })
  );

  t.end();
});
