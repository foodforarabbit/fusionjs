// @flow
import type FusionApp, {Context} from 'fusion-core';
import type {Element} from 'react';
import testApp from './test-app';
import {getSimulator} from 'fusion-test-utils';

export default async function serverRenderTest(
  root: Element<*>,
  url?: string,
  enhanceApp?: (app: FusionApp) => any
): Promise<Context> {
  const app = await testApp();
  if (enhanceApp) {
    enhanceApp(app);
  }
  const simulator = getSimulator(app);
  const ctx = await simulator.request(url || '/');
  return ctx;
}
