// @flow

import * as React from 'react';
import {JSDOM} from 'jsdom';

import {getSimulator} from 'fusion-test-utils';
import App from 'fusion-react';
import type {Context} from 'fusion-core';

import {AtreyuToken} from '@uber/fusion-plugin-atreyu';

import FeatureTogglesPlugin from '@uber/fusion-plugin-feature-toggles';
import {
  FeatureTogglesToken,
  FeatureTogglesClientToken,
  FeatureTogglesTogglesConfigToken,
} from '../src/index.js';
import type {ToggleDetailsType, IFeatureTogglesClient} from '../src/index.js';
import Toggle from '../src/toggle.js';

type AtreyuType = any;

/* Mock(s) */
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
  root?: React.Element<*>
): (() => App) => () => {
  const app = new App(root || React.createElement('div'));

  app.register(FeatureTogglesToken, FeatureTogglesPlugin);
  app.register(AtreyuToken, mockAtreyuFactory());
  app.register(FeatureTogglesClientToken, mockClientFactory(data));
  app.register(FeatureTogglesTogglesConfigToken, [
    'enabledToggle',
    'disabledToggle',
  ]);

  return app;
};

test('simple toggle component usage', async () => {
  const mockToggles = {
    enabledToggle: {
      enabled: true,
    },
    disabledToggle: {
      enabled: false,
    },
  };

  /* Enabled Toggle */
  const EnabledRoot = () => (
    <div>
      Can you see my toggle? <Toggle toggleName="enabledToggle">Yes!</Toggle>
    </div>
  );
  const appWithEnabledToggle = appCreator(
    mockToggles,
    React.createElement(EnabledRoot)
  )();
  await renderAndCompareToSnapshot(
    appWithEnabledToggle,
    'Toggle component usage - enabled'
  );

  /* Disabled Toggle */
  const DisabledRoot = () => (
    <div>
      Can you see my toggle? <Toggle toggleName="disabledRoot">No!</Toggle>
    </div>
  );
  const appWithDisabledToggle = appCreator(
    mockToggles,
    React.createElement(DisabledRoot)
  )();
  await renderAndCompareToSnapshot(
    appWithDisabledToggle,
    'Toggle component usage - enabled'
  );
});

const renderAndCompareToSnapshot = async (
  app: App,
  snapshotName: string
): Promise<void> => {
  const result = await getSimulator(app).render('/');

  const dom = new JSDOM(result.body);
  const body = dom.window.document.querySelector('body');
  expect(body).toBeTruthy();
  expect(body).toHaveProperty('outerHTML');
  expect(body.outerHTML).toMatchSnapshot(snapshotName);
};
