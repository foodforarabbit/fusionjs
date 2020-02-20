// @noflow
import App, {RenderToken} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

import ServerPlugin from '../src/server.js';
import {PageSkeletonConfigToken} from '../src/tokens.js';

test('Server Renderer with options true', async () => {
  const app = new App('test');
  app.register(RenderToken, ServerPlugin);
  app.register(PageSkeletonConfigToken, {
    includeFonts: true,
    includeIcons: true,
    stylesheetUrl: 'test.css',
    faviconUrl: 'test.ico',
  });
  const sim = getSimulator(app);
  const ctx = await sim.render('/');
  const body = ctx.body.replace(/\s+/gm, ' ');
  expect(
    body.includes(
      '<link rel="stylesheet" href="https://d1a3f4spazzrp4.cloudfront.net/uber-icons/3.15.0/uber-icons.css" />'
    )
  ).toBeTruthy();
  expect(
    ctx.body.includes('<link rel="stylesheet" href="test.css" />')
  ).toBeTruthy();
  expect(
    body.includes(
      '<link rel="stylesheet" href="https://d1a3f4spazzrp4.cloudfront.net/uber-fonts/4.0.0/superfine.css" />'
    )
  ).toBeTruthy();
  expect(
    body.includes('<link rel="icon" type="image/x-icon" href="test.ico" />')
  ).toBeTruthy();
  expect(body.includes("<div id='root'></div>")).toBeTruthy();
});

test('Server Renderer with options false', async () => {
  const app = new App('test');
  app.register(RenderToken, ServerPlugin);
  app.register(PageSkeletonConfigToken, {
    includeFonts: false,
    includeIcons: false,
    faviconUrl: null,
  });
  const sim = getSimulator(app);
  const ctx = await sim.render('/');
  const body = ctx.body.replace(/\s+/gm, ' ');
  expect(body.includes('<link rel="stylesheet"')).toBeFalsy();
  expect(
    body.includes('<link rel="icon" type="image/x-icon" href="test.ico" />')
  ).toBeFalsy();
  expect(body.includes("<div id='root'></div>")).toBeTruthy();
});
