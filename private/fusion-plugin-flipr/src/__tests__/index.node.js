// @flow
import App, {createPlugin} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';

import FliprPlugin, {DEFAULT_UPDATE_INTERVAL} from '../server.js';
import {FliprToken, FliprClientToken, FliprConfigToken} from '../tokens.js';

const createMockLogger = () => ({
  log: () => createMockLogger(),
  error: () => createMockLogger(),
  warn: () => createMockLogger(),
  info: () => createMockLogger(),
  verbose: () => createMockLogger(),
  debug: () => createMockLogger(),
  silly: () => createMockLogger(),
});
function createTestFixture(shouldExpect): App {
  const mockLogger = createMockLogger();
  const mockFliprClient = function(config) {
    const {
      propertiesNamespaces,
      logger,
      updateInterval,
      dcPath,
      diskCachePath,
    } = config;
    shouldExpect &&
      expect(
        propertiesNamespaces &&
          propertiesNamespaces.includes('foo') &&
          propertiesNamespaces.includes('foo.local') &&
          propertiesNamespaces.length >= 3
      ).toBeTruthy();
    shouldExpect && expect(logger).toBe(mockLogger);
    shouldExpect && expect(updateInterval).toBe(DEFAULT_UPDATE_INTERVAL);
    shouldExpect && expect(dcPath).toBeTruthy();
    shouldExpect && expect(diskCachePath).toBeTruthy();

    return {
      startUpdating: (): void => shouldExpect && expect(true).toBeTruthy(), // invoked startUpdating()
      randomValue: 999,
      randomFunction: function(): number {
        return this.randomValue;
      },
    };
  };
  const mockConfig = {defaultNamespace: 'foo'};

  const app = new App('content', el => el);
  app.register(FliprToken, FliprPlugin);
  app.register(FliprClientToken, mockFliprClient);
  app.register(FliprConfigToken, mockConfig);

  // $FlowFixMe
  app.register(LoggerToken, mockLogger);
  return app;
}

test('plugin - exported as expected', () => {
  expect(FliprPlugin).toBeTruthy();
  expect(typeof FliprPlugin).toBe('object');
});

test('plugin - service resolved as expected', () => {
  const app = createTestFixture(true);

  let wasResolved = false;
  getSimulator(
    app,
    createPlugin({
      deps: {flipr: FliprToken},

      provides: deps => {
        const {flipr} = deps;
        expect(flipr).toBeTruthy();
        wasResolved = true;
      },
    })
  );

  expect(wasResolved).toBeTruthy();
});

test('plugin - initialization', () => {
  let app = createTestFixture();
  getSimulator(
    app,
    createPlugin({
      deps: {flipr: FliprToken},

      provides: ({flipr}): void => {
        expect(flipr.randomFunction()).toBe(999);
      },
    })
  );
});

test('service - initialization with client error', () => {
  const MockGrumpyFliprClient = function() {
    this.startUpdating = (cb): void => {
      cb(new Error('flipr client is unhappy'));
    };
    return this;
  };

  expect(() => {
    const provides = FliprPlugin.provides;
    if (provides) {
      provides({
        config: {defaultNamespace: 'foo'},
        logger: createMockLogger(),
        Client: MockGrumpyFliprClient,
      });
    }
  }).toThrow(/unhappy/g);
});
