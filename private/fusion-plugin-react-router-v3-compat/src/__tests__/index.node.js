import App from 'fusion-core';
import Router from 'fusion-plugin-react-router';
import {test, getSimulator} from 'fusion-test-utils';
import TestRenderer from 'react-test-renderer';

import Plugin from '../plugin.js';

import RoutesFixtures from '../__fixtures__/routes';

test('Normal route config', async assert => {
  const app = new App(RoutesFixtures.normal, el => {
    const tree = TestRenderer.create(el).toJSON();
    assert.matchSnapshot(tree);
  });

  app.register(Plugin);
  app.register(Router);

  const simulator = getSimulator(app);
  simulator.render('/');
  simulator.render('/fancy');
  simulator.render('/stuff');
});

test('Redirection', async assert => {
  const app = new App(RoutesFixtures.redirect, el => {
    TestRenderer.create(el).toJSON();
  });

  app.register(Plugin);
  app.register(Router);

  const simulator = getSimulator(app);
  const ctx = await simulator.render('/nowhere');
  assert.strictEqual(
    ctx.response.headers.location,
    '/somewhere',
    'redirection matches'
  );
});
