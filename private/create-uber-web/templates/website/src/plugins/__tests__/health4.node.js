// @flow

import {test, getSimulator} from 'fusion-test-utils';
import loadApp from '../../test-utils/test-app';

test('/health request', async t => {
  const app = await loadApp();
  const sim = getSimulator(app);
  // Basic /health request
  const ctx_1 = await sim.request('/health');
  t.equal(ctx_1.status, 200, 'sends 200 status on health request');
  t.equal(ctx_1.body, 'OK', 'sends OK response body');

  // Health Controller default HTTP check - http://t.uber.com/health-controller
  const ctx_2 = await sim.request('/health?type=traffic&service=test-app');
  t.equal(ctx_2.status, 200, 'sends 200 status on health request');
  t.equal(ctx_2.body, 'OK', 'sends OK response body');

  // Health plugin doesn't handle other, similar, paths
  const ctx_3 = await sim.request('/healthother');
  t.equal(ctx_3.status, 404, 'sends 404 status on health request');
  await app.cleanup();
});
