// @noflow
import tape from 'tape-cup';

import App, {RenderToken} from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';

import ServerPlugin from '../server.js';
import {PageSkeletonConfigToken} from '../tokens.js';

tape('Server Renderer with options true', async (t): Promise<void> => {
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
  t.ok(
    body.includes(
      '<link rel="stylesheet" href="https://d1a3f4spazzrp4.cloudfront.net/uber-icons/3.15.0/uber-icons.css" />'
    )
  );
  t.ok(ctx.body.includes('<link rel="stylesheet" href="test.css" />'));
  t.ok(
    body.includes(
      '<link rel="stylesheet" href="https://d1a3f4spazzrp4.cloudfront.net/uber-fonts/4.0.0/superfine.css" />'
    )
  );
  t.ok(
    body.includes('<link rel="icon" type="image/x-icon" href="test.ico" />')
  );
  t.ok(body.includes("<div id='root'></div>"));
  t.end();
});

tape('Server Renderer with options false', async (t): Promise<void> => {
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
  t.notok(body.includes('<link rel="stylesheet"'));
  t.notok(
    body.includes('<link rel="icon" type="image/x-icon" href="test.ico" />')
  );
  t.ok(body.includes("<div id='root'></div>"));
  t.end();
});
