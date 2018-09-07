// @flow
/* eslint-env node */

import Koa from 'koa';
import http from 'http';
import test from 'tape-cup';
import getPort from 'get-port';
import {MagellanUriToken, JarvisUriToken} from '../tokens';
import MagellanPlugin from '../server.js';
import App from 'fusion-core';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';
import request from 'request-promise';

test('Server side plugin', async t => {
  const app = new App('test', () => 'test');
  const magellanPort = await getPort();
  const jarvisPort = await getPort();
  const magellan = new Koa();
  const jarvis = new Koa();
  magellan.use((ctx, next) => {
    if (ctx.url === '/') {
      ctx.body = `<div>Hello World</div>`;
    } else if (ctx.path === '/scripts') {
      ctx.body = `<script>console.log('test');</script>`;
    } else if (ctx.path === '/css') {
      ctx.body = `<link href="/test.css" /><link href="/other.css" />`;
    }
    return next();
  });
  jarvis.use((ctx, next) => {
    if (ctx.url === '/jarvis-standalone/assets') {
      ctx.body = {
        stylesheets: ['/jarvis.css'],
        scripts: ['/test.js'],
      };
    }
    return next();
  });
  const magellanConnection = magellan.listen(magellanPort);
  const jarvisConnection = jarvis.listen(jarvisPort);
  app.register(MagellanPlugin);
  app.register(MagellanUriToken, `http://localhost:${magellanPort}`);
  app.register(JarvisUriToken, `http://localhost:${jarvisPort}`);
  // $FlowFixMe
  app.register(LoggerToken, {
    error: (msg, error) => {},
  });
  const simulator = getSimulator(app);
  // $FlowFixMe
  const ctx = await simulator.render('/');
  t.ok(ctx.body.includes('<div>Hello World</div>'), 'includes magellan html');
  t.ok(ctx.body.includes(`console.log('test')`), 'includes magellan scripts');
  t.ok(
    ctx.body.includes(`<link rel='stylesheet' href='/test.css' />`),
    'includes magellan css'
  );
  t.ok(
    ctx.body.includes(`<link rel='stylesheet' href='/other.css' />`),
    'includes magellan css'
  );
  t.ok(ctx.body.includes(`src='/test.js'`), 'includes jarvis scripts');
  t.ok(
    ctx.body.includes(`<link rel='stylesheet' href='/jarvis.css' />`),
    'includes jarvis css'
  );
  magellanConnection.close();
  jarvisConnection.close();
  t.end();
});

test('Server side plugin proxies', async t => {
  const app = new App('test', () => 'test');
  const magellanPort = await getPort();
  const jarvisPort = await getPort();
  const rootPort = await getPort();
  const magellan = new Koa();
  const jarvis = new Koa();
  magellan.use((ctx, next) => {
    if (ctx.url === '/test') {
      ctx.body = 'OK';
    }
    return next();
  });
  jarvis.use((ctx, next) => {
    if (ctx.url === '/jarvis-standalone/test') {
      ctx.body = 'OK';
    }
    return next();
  });
  const magellanConnection = magellan.listen(magellanPort);
  const jarvisConnection = jarvis.listen(jarvisPort);
  app.register(MagellanPlugin);
  app.register(MagellanUriToken, `http://localhost:${magellanPort}`);
  app.register(JarvisUriToken, `http://localhost:${jarvisPort}`);
  // $FlowFixMe
  app.register(LoggerToken, {
    error: (msg, error) => {},
  });
  // $FlowFixMe
  const appServer = http.createServer(app.callback());
  appServer.listen(rootPort);
  const magellanResponse = await request(
    `http://localhost:${rootPort}/magellan/test`
  );
  const jarvisResponse = await request(
    `http://localhost:${rootPort}/jarvis-standalone/test`
  );
  t.equal(magellanResponse, 'OK', 'proxies magellan requests');
  t.equal(jarvisResponse, 'OK', 'proxies magellan requests');
  appServer.close();
  magellanConnection.close();
  jarvisConnection.close();
  t.end();
});
