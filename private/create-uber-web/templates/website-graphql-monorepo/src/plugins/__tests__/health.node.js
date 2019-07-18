// @flow

import {getSimulator} from 'fusion-test-utils';
import loadApp from '../../test-utils/test-app.js';

test('/health request', async () => {
  const app = await loadApp();
  const sim = getSimulator(app);
  // Basic /health request
  const ctx_1 = await sim.request('/health');
  expect(ctx_1.status).toEqual(200);
  expect(ctx_1.body).toEqual('OK');

  // Health Controller default HTTP check - http://t.uber.com/health-controller
  const ctx_2 = await sim.request('/health?type=traffic&service=test-app');
  expect(ctx_2.status).toEqual(200);
  expect(ctx_2.body).toEqual('OK');

  // Health plugin doesn't handle other, similar, paths
  const ctx_3 = await sim.request('/healthother');
  expect(ctx_3.status).toEqual(404);
  await app.cleanup();
});
