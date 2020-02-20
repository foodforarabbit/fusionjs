// @flow
/* eslint-env node */

import {JSDOM} from 'jsdom';

import {getService, getSimulator} from 'fusion-test-utils';
import App from 'fusion-core';
import type {Context} from 'fusion-core';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';

import FeatureTogglesPlugin from '../src/server.js';

import {
  FeatureTogglesClientToken,
  FeatureTogglesTogglesConfigToken,
} from '../src/index.js';
import type {
  ToggleDetailsType,
  IFeatureTogglesClient,
  FeatureToggleConfigType,
} from '../src/index.js';

type AtreyuType = any;

/* Mock(s) */
const mockContextFactory: () => Context = () =>
  ({
    // necessary to handle ctx.memoized call
    memoized: new Map(),
  }: any);
const mockAtreyuFactory: () => AtreyuType = () => ({}: any);
type MockDataType = {[string]: ToggleDetailsType};
const mockClientFactory: (
  data?: MockDataType
) => Class<IFeatureTogglesClient> = data => {
  class MockClient implements IFeatureTogglesClient {
    constructor(ctx: Context): IFeatureTogglesClient {
      return this;
    }
    async load(): Promise<void> {}
    get(toggleName: string): ToggleDetailsType {
      if (!data || !data[toggleName]) return {enabled: false};
      return data[toggleName];
    }
  }
  return MockClient;
};

/* App Creator(s) */
const appCreator = (
  data?: MockDataType,
  toggleConfigs?: ?Array<FeatureToggleConfigType | string>
) => () => {
  const app = new App('el', el => el);

  app.register(FeatureTogglesPlugin);
  app.register(AtreyuToken, mockAtreyuFactory());
  app.register(FeatureTogglesClientToken, mockClientFactory(data));
  app.register(
    FeatureTogglesTogglesConfigToken,
    toggleConfigs ? toggleConfigs : ['weatherToggle']
  );

  return app;
};

test('simple service sanity check - toggle on/off with mocked dependencies', async () => {
  const mockContext = mockContextFactory();
  const mockToggles = {
    toggleOn: {
      enabled: true,
    },
    toggleOff: {
      enabled: false,
    },
  };
  const service = getService(appCreator(mockToggles), FeatureTogglesPlugin);
  const instance = service.from(mockContext);

  const onResult = await instance.get('toggleOn');
  expect(onResult).not.toBeNull();
  if (!onResult) throw new Error('onResult is null!'); // necessary to appease Flow
  expect(onResult).toHaveProperty('enabled');
  expect(onResult.enabled).toBeTruthy();

  const offResult = await instance.get('toggleOff');
  expect(offResult).not.toBeNull();
  if (!offResult) throw new Error('offResult is null!'); // necessary to appease Flow
  expect(offResult).toHaveProperty('enabled');
  expect(offResult.enabled).not.toBeTruthy();

  const missingResult = await instance.get('missingToggle');
  expect(missingResult).not.toBeNull();
  if (!missingResult) throw new Error('missingResult is null!'); // necessary to appease Flow
  expect(missingResult).toHaveProperty('enabled');
  expect(missingResult.enabled).not.toBeTruthy();
});

test('test service metadata with mocked dependencies', async () => {
  const mockContext = mockContextFactory();
  const mockToggles = {
    weatherToggle: {
      enabled: true,
      metadata: {
        isItSunnyToday: true,
        areThereWaves: false,
      },
    },
  };
  const service = getService(appCreator(mockToggles), FeatureTogglesPlugin);
  const instance = service.from(mockContext);

  const result = await instance.get('weatherToggle');
  expect(result).not.toBeNull();
  if (!result) throw new Error('Result is null!'); // necessary to appease Flow
  expect(result).toHaveProperty('metadata');
  const metadata = result.metadata;
  expect(metadata).not.toBeNull();
  if (!metadata) throw new Error('Metadata is null!'); // necessary to appease Flow
  expect(metadata).toHaveProperty('isItSunnyToday');
  expect(metadata.isItSunnyToday).toBeTruthy();
  expect(metadata).toHaveProperty('areThereWaves');
  expect(metadata.areThereWaves).not.toBeTruthy();
});

test('test ssr', async () => {
  const mockContext = mockContextFactory();
  const mockToggles = {
    weatherToggle: {
      enabled: true,
      metadata: {
        isItSunnyToday: true,
        areThereWaves: false,
      },
    },
  };
  const service = getService(appCreator(mockToggles), FeatureTogglesPlugin);
  const instance = service.from(mockContext);

  const result = await instance.get('weatherToggle');
  expect(result).not.toBeNull();
  if (!result) throw new Error('Result is null!'); // necessary to appease Flow
  expect(result).toHaveProperty('metadata');
  const metadata = result.metadata;
  expect(metadata).not.toBeNull();
  if (!metadata) throw new Error('Metadata is null!'); // necessary to appease Flow
  expect(metadata).toHaveProperty('isItSunnyToday');
  expect(metadata.isItSunnyToday).toBeTruthy();
  expect(metadata).toHaveProperty('areThereWaves');
  expect(metadata.areThereWaves).not.toBeTruthy();
});

test('test default client dependencies', async () => {
  const appFactory = () => {
    const app = new App('el', el => el);
    app.register(FeatureTogglesPlugin);
    app.register(FeatureTogglesTogglesConfigToken, []);
    return app;
  };

  // Without required (for default) AtreyuToken registration
  expect(() => getService(appFactory, FeatureTogglesPlugin)).toThrow();

  // With Atrey client
  const app = appFactory();
  app.register(AtreyuToken, mockAtreyuFactory());
  expect(() => getService(() => app, FeatureTogglesPlugin)).not.toThrow();
});

test('__FEATURE_TOGGLES__ populated', async () => {
  const mockToggles = {
    weatherToggle: {
      enabled: true,
      metadata: {
        isItSunnyToday: true,
        areThereWaves: false,
      },
    },
  };
  const app = appCreator(mockToggles)();
  const result = await getSimulator(app).render('/');

  const dom = new JSDOM(result.body);
  const elem = dom.window.document.querySelector(
    "script[id='__FEATURE_TOGGLES__'"
  );
  expect(elem).toBeTruthy();
  expect(elem).toHaveProperty('outerHTML');
  expect(elem.outerHTML).toMatchSnapshot('__FEATURE_TOGGLES__');
});

test('context is required on server', async () => {
  const service = getService(appCreator(), FeatureTogglesPlugin);
  expect(() => service.from()).toThrow();
});

test('only client-safe toggles exposed in __FEATURE_TOGGLES__ ', async () => {
  const mockToggles = {
    weatherToggle: {
      enabled: true,
      metadata: {
        isItSunnyToday: true,
        areThereWaves: false,
      },
    },
    serverOnly: {
      enabled: true,
      metadata: {
        shouldNotBeOnClient: false,
      },
    },
  };

  const app = appCreator(mockToggles, [
    {name: 'serverOnly', exposeToClient: false},
    'weatherToggle',
  ])();
  const result = await getSimulator(app).render('/');

  const dom = new JSDOM(result.body);
  const elem = dom.window.document.querySelector(
    "script[id='__FEATURE_TOGGLES__'"
  );
  expect(elem).toBeTruthy();
  expect(elem).toHaveProperty('outerHTML');
  expect(elem.outerHTML).toMatchSnapshot(
    '__FEATURE_TOGGLES__-limited-client-side'
  );
});

test('skip middleware if no toggle details provided', async () => {
  const app = appCreator({}, [])();

  // Override 'FeatureTogglesClientToken' registration to track .load call
  const loadFn = jest.fn();
  const getFn = jest.fn();
  class MockCheckLoadClient implements IFeatureTogglesClient {
    constructor(ctx: Context): IFeatureTogglesClient {
      return this;
    }
    async load(): Promise<void> {
      return loadFn();
    }
    get(toggleName: string): ToggleDetailsType {
      return getFn();
    }
  }
  app.register(FeatureTogglesClientToken, MockCheckLoadClient);

  const result = await getSimulator(app).render('/');

  // Ensure load and get were not called
  expect(loadFn).toHaveBeenCalledTimes(0);
  expect(getFn).toHaveBeenCalledTimes(0);

  const dom = new JSDOM(result.body);
  const elem = dom.window.document.querySelector(
    "script[id='__FEATURE_TOGGLES__'"
  );
  expect(elem).toBeTruthy();
  expect(elem).toHaveProperty('outerHTML');
  expect(elem.outerHTML).toMatchSnapshot(
    '__FEATURE_TOGGLES__-empty-no-details-provided'
  );
});
