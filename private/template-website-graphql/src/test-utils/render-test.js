// @flow
import type {Element} from 'react';
import {render} from '@testing-library/react';
import initUI from '../uber/ui';
import {getSimulator} from 'fusion-test-utils';
import App from 'fusion-react';

export default async function renderTest(
  root: Element<*>,
  url: ?string
): Promise<any> {
  const app = new App(root, (render: any));
  initUI(app);
  const simulator = getSimulator(app);
  const ctx = await simulator.render(url || '/');
  return ctx.rendered;
}
