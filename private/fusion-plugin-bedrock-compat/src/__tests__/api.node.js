import HttpHandlerPlugin, {HttpHandlerToken} from 'fusion-plugin-http-handler';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {GalileoToken} from '@uber/fusion-plugin-galileo';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import App, {createPlugin} from 'fusion-core';

import getPort from 'get-port';
import http from 'http';
import request from 'request-promise';
import tape from 'tape-cup';

import Plugin, {InitializeServerToken, BedrockCompatToken} from '../index.js';

tape('exports api', t => {
  t.ok(Plugin, 'export default a Plugin');
  t.ok(InitializeServerToken, 'exports an InitializeServerToken');
  t.ok(BedrockCompatToken, 'exports a BedrockCompatToken');
  t.end();
});

tape('provides', async t => {
  const app = new App('el', () => 'hello');
  app.register(BedrockCompatToken, Plugin);
  app.register(LoggerToken, 'logger');
  app.register(AtreyuToken, 'atreyu');
  app.register(M3Token, 'm3');
  app.register(GalileoToken, {galileo: 'galileo'});
  app.register(InitializeServerToken, (server, cb) => {
    t.equal(server.config.test, true);
    t.equal(server.logger, 'logger');
    t.equal(server.m3, 'm3');
    t.equal(server.clients.logger, 'logger');
    t.equal(server.clients.m3, 'm3');
    t.equal(server.clients.galileo, 'galileo');
    t.equal(server.clients.atreyu, 'atreyu');
    t.equal(typeof cb, 'function');
    server.get('/', (req, res) => {
      t.equal(
        req.headers['x-test'],
        'test-value',
        'sets mock headers for bedrock middleware'
      );
      res.status(200);
      res.json(res.locals.state);
    });
    return server;
  });
  app.register(
    HttpHandlerToken,
    createPlugin({
      deps: {
        server: BedrockCompatToken,
      },
      provides: ({server}) => server.app,
    })
  );
  app.register(HttpHandlerPlugin);
  app.middleware((ctx, next) => {
    t.equal(
      ctx.req.headers['x-test'],
      'test-value',
      'sets mock headers for other fusion plugins'
    );
    return next();
  });
  const server = http.createServer(app.callback());
  const port = await getPort();
  server.listen(port);
  const res = JSON.parse(await request(`http://localhost:${port}/`));
  t.equal(typeof res.bedrock.assets, 'object');
  t.equal(typeof res.bedrock.auth, 'object');
  server.close();
  t.end();
});
