import tape from 'tape-cup';
import FliprPlugin, {DEFAULT_UPDATE_INTERVAL} from '../../server';

tape('Flipr plugin - initialization', t => {
  t.throws(
    () => FliprPlugin({config: {}}),
    /namespace/g,
    'Throws without `defaultNamespace` or `propertiesNamespaces`'
  );

  t.throws(
    () => FliprPlugin({config: {defaultNamespace: 'foo'}, Logger: {}}),
    /Logger/g,
    'Throws when providing an invalid Logger'
  );

  t.doesNotThrow(
    () => FliprPlugin({config: {defaultNamespace: 'foo'}}),
    /Logger/g,
    'Does not throw when no logger provided'
  );

  const MockLogger = {};

  const MockFliprClient = function(config) {
    const {
      propertiesNamespaces,
      logger,
      updateInterval,
      dcPath,
      diskCachePath,
    } = config;
    t.ok(
      propertiesNamespaces.includes('foo') &&
        propertiesNamespaces.includes('foo.local') &&
        propertiesNamespaces.length >= 3,
      'propertiesNamespaces automatically mapped'
    );
    t.equal(logger, MockLogger, 'Logger passed onto Flipr client');
    t.equal(
      updateInterval,
      DEFAULT_UPDATE_INTERVAL,
      'set default update interval'
    );
    t.ok(dcPath, 'set DEV dcPath');
    t.ok(diskCachePath, 'set DEV diskCachePath');

    this.startUpdating = () => t.pass('invoked startUpdating()');
    this.randomFunction = () => {};
  };

  const flipr = FliprPlugin({
    config: {
      defaultNamespace: 'foo',
    },
    Logger: {
      of: () => {
        t.pass('Logger instantiated');
        return MockLogger;
      },
    },
    Client: MockFliprClient,
  }).of();

  t.ok(flipr.randomFunction, 'Flipr client functions proxied on the service');

  t.end();
});

tape('Flipr plugin - initialization with client error', t => {
  const MockGrumpyFliprClient = function() {
    this.startUpdating = cb => {
      cb(new Error('flipr client is unhappy'));
    };
  };

  t.throws(
    () =>
      FliprPlugin({
        config: {
          defaultNamespace: 'foo',
        },
        Client: MockGrumpyFliprClient,
      }).of(),
    /unhappy/g,
    're-throws on startUpdating()'
  );

  t.end();
});
