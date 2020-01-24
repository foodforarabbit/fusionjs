// @flow
import HttpHandlerPlugin, {HttpHandlerToken} from 'fusion-plugin-http-handler';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {GalileoToken} from '@uber/fusion-plugin-galileo';
import {LoggerToken} from 'fusion-tokens';
import {M3Token} from '@uber/fusion-plugin-m3';
import {FliprToken} from '@uber/fusion-plugin-flipr';
import App, {createPlugin} from 'fusion-core';

import getPort from 'get-port';
import http from 'http';
import request from 'request-promise';

import Plugin, {InitializeServerToken, BedrockCompatToken} from '../index.js';

test('exports api', () => {
  expect(Plugin).toBeTruthy();
  expect(InitializeServerToken).toBeTruthy();
  expect(BedrockCompatToken).toBeTruthy();
});

test('provides', async () => {
  const app = new App('el', () => 'hello');
  app.register(BedrockCompatToken, Plugin);
  app.register(LoggerToken, ('logger': any));
  app.register(AtreyuToken, 'atreyu');
  app.register(M3Token, ('m3': any));
  app.register(GalileoToken, {galileo: 'galileo'});
  app.register(FliprToken, ('flipr': any));
  app.register(InitializeServerToken, (server, cb) => {
    expect(server.config.test).toBe(true);
    expect(server.logger).toBe('logger');
    expect(server.m3).toBe('m3');
    expect(server.clients.logger).toBe('logger');
    expect(server.clients.m3).toBe('m3');
    expect(server.clients.galileo).toBe('galileo');
    expect(server.clients.atreyu).toBe('atreyu');
    expect(server.clients.flipr).toBe('flipr');
    expect(typeof cb).toBe('function');
    server.get('/', (req, res) => {
      expect(req.headers['x-test']).toBe('test-value');
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
  const server = http.createServer((app.callback(): any));
  const port = await getPort();
  server.listen(port);
  const res = JSON.parse(await request(`http://localhost:${port}/`));
  expect(typeof res.bedrock.assets).toBe('object');
  expect(typeof res.bedrock.auth).toBe('object');
  server.close();
});
