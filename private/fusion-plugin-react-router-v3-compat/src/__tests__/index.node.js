/* global jest */

import App from 'fusion-core';
import {LoggerToken} from 'fusion-tokens';
import {test, getSimulator} from 'fusion-test-utils';
import TestRenderer from 'react-test-renderer';

import Plugin from '../plugin.js';
import {ReactRouterV3MatcherToken} from '../server';

import RoutesFixtures from '../__fixtures__/routes';

test('Normal route config', async assert => {
  const app = new App(RoutesFixtures.normal, el => {
    const tree = TestRenderer.create(el).toJSON();
    assert.matchSnapshot(tree);
  });
  app.register(LoggerToken, null);

  const simulator = getSimulator(app, Plugin);
  simulator.render('/');
  simulator.render('/fancy');
  simulator.render('/stuff');
});

test('Redirection', async assert => {
  const app = new App(RoutesFixtures.redirect, el => el);
  app.register(LoggerToken, null);

  const simulator = getSimulator(app, Plugin);
  const ctx = await simulator.render('/nowhere');
  assert.strictEqual(
    ctx.response.headers.location,
    '/somewhere',
    'redirection matches'
  );
});

test('404 Not found', async assert => {
  const app = new App(RoutesFixtures.normal, el => el);
  const mockLogger = {error: jest.fn()};
  app.register(LoggerToken, mockLogger);

  const simulator = getSimulator(app, Plugin);
  const ctx = await simulator.render('/404');

  assert.ok(ctx.body, 'ctx.body is set');
  assert.strictEqual(ctx.status, 404, 'status = 404');
  assert.strictEqual(mockLogger.error.mock.calls.length, 1, 'Error logged');
});

test('500 MatchError', async assert => {
  const app = new App(RoutesFixtures.normal, el => el);
  const mockLogger = {error: jest.fn()};
  app.register(LoggerToken, mockLogger);
  app.register(ReactRouterV3MatcherToken, (params, cb) =>
    cb(new Error('TEST_ERROR'))
  );

  const simulator = getSimulator(app, Plugin);
  const ctx = await simulator.render('/anything');

  assert.ok(ctx.body, 'ctx.body is set');
  assert.strictEqual(ctx.status, 500, 'status = 500');
  assert.strictEqual(mockLogger.error.mock.calls.length, 1, 'Error logged');
});
