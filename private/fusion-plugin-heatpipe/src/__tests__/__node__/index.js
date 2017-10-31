/* eslint-env node */
import tape from 'tape-cup';
import HeatpipePlugin from '../../server';

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

  const mockM3ServiceInstance = {};
  const mockM3Service = {of: () => mockM3ServiceInstance};

  const mockLoggerServiceInstance = {};
  const mockLoggerService = {of: () => mockLoggerServiceInstance};

  const types = ['publish'];
  const events = {
    of() {
      return {
        on(type) {
          t.equal(
            type,
            `heatpipe:${types.shift()}`,
            'adds event handler correctly'
          );
        },
      };
    },
  };

  const called = {connect: false, destroy: false};

  class Client {
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

  const heatpipe = HeatpipePlugin({
    M3: mockM3Service,
    Logger: mockLoggerService,
    UniversalEvents: events,
    Client,
    heatpipeConfig: fixture.heatpipeConfig,
  }).of();

  t.ok(
    called.connect,
    'HeatpipePublisher.connect() - invoked upon service instantiation'
  );

  try {
    await heatpipe.asyncPublish(fixture.topicInfo, fixture.message);
  } catch (err) {
    t.equal(
      err,
      fixture.error,
      'service instance asyncPublish() - throws error'
    );
  }

  heatpipe.publish(fixture.topicInfo, fixture.message, err => {
    t.equal(err, fixture.error, 'service instance publish() - throws error');
  });

  heatpipe.destroy();

  t.ok(
    called.destroy,
    'HeatpipePublisher.destroy() - invoked upon service instance destroy'
  );

  t.end();
});
