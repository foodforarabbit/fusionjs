import tape from 'tape-cup';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import plugin from '../browser';

tape('Rosetta plugin', async t => {
  const app = new App('el', el => el);
  app.register(plugin);
  const sim = getSimulator(app);
  const result = await sim.render('/');
  t.ok(result);
  t.end();
});
