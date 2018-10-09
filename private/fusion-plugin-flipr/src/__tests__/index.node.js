// @flow
import test from 'tape-cup';

import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';

import FliprPlugin, {DEFAULT_UPDATE_INTERVAL} from '../server';
import {FliprToken, FliprClientToken, FliprConfigToken} from '../tokens';

function createTestFixture(t) {
  const mockLogger = () => {};
  const mockFliprClient = function(config) {
    const {
      propertiesNamespaces,
      logger,
      updateInterval,
      dcPath,
      diskCachePath,
    } = config;
    t &&
      t.ok(
        propertiesNamespaces.includes('foo') &&
          propertiesNamespaces.includes('foo.local') &&
          propertiesNamespaces.length >= 3,
        'propertiesNamespaces automatically mapped'
      );
    t && t.equal(logger, mockLogger, 'Logger passed onto Flipr client');
    t &&
      t.equal(
        updateInterval,
        DEFAULT_UPDATE_INTERVAL,
        'set default update interval'
      );
    t && t.ok(dcPath, 'set DEV dcPath');
    t && t.ok(diskCachePath, 'set DEV diskCachePath');

    this.startUpdating = () => t && t.pass('invoked startUpdating()');
    this.randomFunction = () => {};
  };
  const mockConfig = {
    defaultNamespace: 'foo',
  };

  const app = new App('content', el => el);
  app.register(FliprToken, FliprPlugin);
  app.register(FliprClientToken, mockFliprClient);
  app.register(FliprConfigToken, mockConfig);
  app.register(LoggerToken, mockLogger);
  return app;
}

test('plugin - exported as expected', t => {
  t.ok(FliprPlugin, 'plugin defined as expected');
  t.equal(typeof FliprPlugin, 'object', 'plugin is an object');
  t.end();
});

test('plugin - service resolved as expected', t => {
  const app = createTestFixture(t);

  let wasResolved = false;
  getSimulator(
    app,
    createPlugin({
      deps: {flipr: FliprToken},
      provides: deps => {
        const {flipr} = deps;
        t.ok(flipr);
        wasResolved = true;
      },
    })
  );

  t.true(wasResolved, 'test plugin was resolved');
  t.end();
});

test('plugin - initialization', t => {
  let app = createTestFixture();
  getSimulator(
    app,
    createPlugin({
      deps: {flipr: FliprToken},
      provides: ({flipr}) => {
        t.ok(
          flipr.randomFunction,
          'Flipr client functions proxied on the service'
        );
      },
    })
  );

  t.end();
});

test('service - initialization with client error', t => {
  const MockGrumpyFliprClient = function() {
    this.startUpdating = cb => {
      cb(new Error('flipr client is unhappy'));
    };
  };

  t.throws(
    () =>
      FliprPlugin.provides({
        config: {
          defaultNamespace: 'foo',
        },
        Client: MockGrumpyFliprClient,
      }),
    /unhappy/g,
    're-throws on startUpdating()'
  );

  t.end();
});
