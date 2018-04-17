import App from 'fusion-core';
import {test, getSimulator} from 'fusion-test-utils';
import TestRenderer from 'react-test-renderer';
import {createMemoryHistory} from '../index';

import Plugin from '../plugin.js';
import {ReactRouterV3HistoryToken} from '../browser';

import RoutesFixtures from '../__fixtures__/routes';

function testPath(routes, path, assert) {
  const app = new App(routes, el => {
    const tree = TestRenderer.create(el).toJSON();
    assert.matchSnapshot(tree);
  });
  const memoryHistory = createMemoryHistory(path);
  app.register(ReactRouterV3HistoryToken, memoryHistory);

  const simulator = getSimulator(app, Plugin);
  simulator.render(path);
}

test('Normal route config', async assert => {
  const routes = RoutesFixtures.normal;
  testPath(routes, '/', assert);
  testPath(routes, '/fancy', assert);
  testPath(routes, '/stuff', assert);
});
