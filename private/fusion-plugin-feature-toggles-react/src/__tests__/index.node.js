// @flow
/* eslint-env node */

import {getService} from 'fusion-test-utils';
import App from 'fusion-core';
import type {Context} from 'fusion-core';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';

import FeatureTogglesPlugin from '../plugin.js';

import {
  FeatureTogglesClientToken,
  FeatureTogglesToggleNamesToken,
} from '../index.js';
import type {ToggleDetailsType, IFeatureTogglesClient} from '../index.js';

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
    async get(toggleName: string): Promise<ToggleDetailsType> {
      if (!data || !data[toggleName]) return {enabled: false};
      return data[toggleName];
    }
  }
  return MockClient;
};

/* App Creator(s) */
const appCreator = (data?: MockDataType) => () => {
  const app = new App('el', el => el);

  app.register(FeatureTogglesPlugin);
  app.register(AtreyuToken, mockAtreyuFactory());
  app.register(FeatureTogglesClientToken, mockClientFactory(data));
  app.register(FeatureTogglesToggleNamesToken, ['weatherToggle']);

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
