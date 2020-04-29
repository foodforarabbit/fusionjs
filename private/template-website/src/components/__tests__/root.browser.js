// @flow

import {test, getSimulator} from 'fusion-test-utils';
import loadApp from '../../test-utils/test-app';

test('Root renders', async () => {
  const app = await loadApp();
  const sim = getSimulator(app);
  const ctx = await sim.render('/');
  const element = ctx.rendered.getByText('Welcome');
  expect(element).toBeDefined();
});
