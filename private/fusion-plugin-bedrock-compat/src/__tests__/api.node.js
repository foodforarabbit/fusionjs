import App from 'fusion-core';
import tape from 'tape-cup';
import {getSimulator} from 'fusion-test-utils';
import {LoggerToken} from 'fusion-tokens';
import {AtreyuToken} from '@uber/fusion-plugin-atreyu';
import {M3Token} from '@uber/fusion-plugin-m3';
import {GalileoToken} from '@uber/fusion-plugin-galileo';

import Plugin, {InitializeServerToken, BedrockCompatToken} from '../index.js';

tape('exports api', t => {
  t.ok(Plugin, 'export default a Plugin');
  t.ok(InitializeServerToken, 'exports an InitializeServerToken');
  t.ok(BedrockCompatToken, 'exports a BedrockCompatToken');
  t.end();
});

tape('provides', t => {
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
    t.end();
    return server;
  });
  getSimulator(app);
});
