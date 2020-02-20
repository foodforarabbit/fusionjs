// @flow
/* eslint-env node */

const {GalileoToken} = require('@uber/fusion-plugin-galileo');
const {LoggerToken} = require('fusion-tokens');
const {TracerToken} = require('@uber/fusion-plugin-tracer');
const {mock: mockM3, M3Token} = require('@uber/fusion-plugin-m3');
const App = require('fusion-core').default;
const {createPlugin, SSRDeciderToken} = require('fusion-core');

/*::
import type {Context} from 'fusion-core';
import type {IncomingMessage, ServerResponse} from 'http';
*/

const {getSimulator} = require('fusion-test-utils');
const getPort = require('get-port');
const http = require('http');
const request = require('request-promise');

const {ProxyConfigToken} = require('../src/tokens');
const ProxyDecider = require('../src/decider.js');
const ProxyPlugin = require('../src/plugin.js');

// $FlowFixMe
const {getProxyHeaders} = require('../src/plugin.js');

function getMockTracer() /*: {
  from: (ctx: Context) => {span: any, tracer: any},
  tracer: any,
} */ {
  return {
    tracer: {},

    from: (ctx) /*: {|span: any, tracer: any|} */ => {
      expect(ctx).toBeTruthy();
      return {tracer: {}, span: {}};
    },
  };
}

function getMockGalileo(
  fn /*: (proxyName: empty, type: empty, span: empty, cb: empty) => void */
) /*: {|
  galileo: {|
    AuthenticateOut: (
      proxyName: empty,
      type: empty,
      span: empty,
      cb: empty
    ) => void,
  |},
|} */ {
  return {
    galileo: {
      AuthenticateOut(proxyName, type, span, cb) /*: void */ {
        return fn(proxyName, type, span, cb);
      },
    },
  };
}

test('proxies GET requests', async () => {
  const app = new App('el', el => el);
  const proxyPort = await getPort();
  const appPort = await getPort();

  // $FlowFixMe
  app.register(M3Token, mockM3);
  let M3 = null;
  app.register(
    createPlugin({
      deps: {m3: M3Token},

      middleware: ({m3}) => async (
        ctx /*: Context */,
        next /*: () => Promise<void> */
      ) /*: Promise<void> */ => {
        await next();
        // $FlowFixMe
        expect(ctx.req.m3Tags.route).toBe('root');
        M3 = m3;
      },
    })
  );

  app.register(ProxyPlugin);

  // $FlowFixMe
  app.register(LoggerToken, console);
  app.register(TracerToken, getMockTracer());
  app.register(
    GalileoToken,
    getMockGalileo((proxyName, type, span, cb) /*: void */ => {
      expect(proxyName).toBe('test');
      expect(type).toBe('http');
      expect(span).toBeTruthy();
      expect(typeof cb).toBe('function');
      cb(null, {'x-test': 'test-value'});
    })
  );
  app.register(ProxyConfigToken, {
    test: {
      uri: `http://localhost:${proxyPort}`,
      routes: [{route: '/*', headers: {'x-next': 'correct'}, m3Key: 'root'}],
      headers: {'x-value': 'some-value', 'x-next': 'whoops'},
    },
  });

  const proxyServer = http.createServer((
    req /*: IncomingMessage */,
    res /*: ServerResponse */
  ) /*: void */ => {
    expect(req.url).toBe('/hello?a=b');
    expect(req.headers['x-hello']).toBe('world');
    expect(req.headers['x-test']).toBe('test-value');
    expect(req.headers['x-value']).toBe('some-value');
    expect(req.headers['x-next']).toBe('correct');
    expect(req.headers['x-uber-app']).toBeTruthy();
    expect(req.headers['x-csrf-token']).toBeFalsy();
    res.writeHead(200);
    res.end('OK');
  });
  const proxyConnection = proxyServer.listen(proxyPort);

  // $FlowFixMe
  const appServer = http.createServer(app.callback());
  const connection = appServer.listen(appPort);

  const res = await request(`http://localhost:${appPort}/test/hello?a=b`, {
    headers: {
      'x-test': 'something',
      'x-hello': 'world',
      'x-csrf-token': 'lol',
    },
  });
  expect(res).toBe('OK');
  proxyConnection.close();
  connection.close();

  // $FlowFixMe
  const m3Calls = M3.getCalls();
  expect(m3Calls[0]).toEqual([
    'timing',
    ['proxy_socket_time', m3Calls[0][1][1], {route: 'root'}],
  ]);
  expect(m3Calls[1]).toEqual([
    'timing',
    ['proxy_header_time', m3Calls[1][1][1], {status_code: 200, route: 'root'}],
  ]);
  expect(m3Calls[2]).toEqual([
    'timing',
    ['proxy_response_time', m3Calls[2][1][1], {route: 'root'}],
  ]);
});

test('galileo error handling', async () => {
  const app = new App('el', el => el);
  const proxyPort = await getPort();
  const appPort = await getPort();

  app.register(M3Token, mockM3);
  let M3 = null;
  app.register(
    createPlugin({
      deps: {m3: M3Token},

      middleware: ({m3}) => async (
        ctx /*: Context */,
        next /*: () => Promise<void> */
      ) /*: Promise<void> */ => {
        await next();
        M3 = m3;
      },
    })
  );

  app.register(ProxyPlugin);

  // $FlowFixMe
  app.register(LoggerToken, {
    error: (message, {path}) /*: void */ => {
      expect(message).toBe('test error');
      expect(path).toBe('/test/hello');
    },
  });
  app.register(TracerToken, getMockTracer());
  app.register(
    GalileoToken,
    getMockGalileo((proxyName, type, span, cb) /*: void */ => {
      expect(proxyName).toBe('test');
      expect(type).toBe('http');
      expect(span).toBeTruthy();
      expect(typeof cb).toBe('function');
      cb(new Error('test error'));
    })
  );
  app.register(ProxyConfigToken, {
    test: {
      uri: `http://localhost:${proxyPort}`,
      routes: [{route: '/*', m3Key: 'root'}],
    },
  });

  const proxyServer = http.createServer((
    req /*: IncomingMessage */,
    res /*: ServerResponse */
  ) /*: void */ => {
    expect(req.url).toBe('/hello?a=b');
    expect(req.headers['x-hello']).toBe('world');
    expect(req.headers['x-test']).toBe('something');
    expect(req.headers['x-uber-app']).toBeTruthy();
    expect(req.headers['x-csrf-token']).toBeFalsy();
    res.writeHead(200);
    res.end('OK');
  });
  const proxyConnection = proxyServer.listen(proxyPort);

  // $FlowFixMe
  const appServer = http.createServer(app.callback());
  const connection = appServer.listen(appPort);

  const res = await request(`http://localhost:${appPort}/test/hello?a=b`, {
    headers: {
      'x-test': 'something',
      'x-hello': 'world',
      'x-csrf-token': 'lol',
    },
  });
  expect(res).toBe('OK');
  proxyConnection.close();
  connection.close();

  // $FlowFixMe
  const m3Calls = M3.getCalls();
  expect(m3Calls[0]).toEqual([
    'timing',
    ['proxy_socket_time', m3Calls[0][1][1], {route: 'root'}],
  ]);
  expect(m3Calls[1]).toEqual([
    'timing',
    ['proxy_header_time', m3Calls[1][1][1], {status_code: 200, route: 'root'}],
  ]);
  expect(m3Calls[2]).toEqual([
    'timing',
    ['proxy_response_time', m3Calls[2][1][1], {route: 'root'}],
  ]);
});

test('proxies POST requests', async () => {
  const app = new App('el', el => el);
  const proxyPort = await getPort();
  const appPort = await getPort();

  app.register(M3Token, mockM3);
  let M3 = null;
  app.register(
    createPlugin({
      deps: {m3: M3Token},

      middleware: ({m3}) => async (
        ctx /*: Context */,
        next /*: () => Promise<void> */
      ) /*: Promise<void> */ => {
        await next();
        M3 = m3;
      },
    })
  );

  app.register(ProxyPlugin);

  // $FlowFixMe
  app.register(LoggerToken, console);
  app.register(TracerToken, getMockTracer());
  app.register(
    GalileoToken,
    getMockGalileo((proxyName, type, span, cb) /*: void */ => {
      expect(proxyName).toBe('test');
      expect(type).toBe('http');
      expect(span).toBeTruthy();
      expect(typeof cb).toBe('function');
      cb(null, {'x-test': 'test-value'});
    })
  );
  app.register(ProxyConfigToken, {
    test: {
      uri: `http://localhost:${proxyPort}`,
      routes: [{route: '/*', m3Key: 'root'}],
    },
  });

  const proxyServer = http.createServer((
    req /*: IncomingMessage */,
    res /*: ServerResponse */
  ) /*: void */ => {
    const buff = [];
    expect(req.url).toBe('/hello?a=b');
    expect(req.headers['x-hello']).toBe('world');
    expect(req.headers['x-test']).toBe('test-value');
    expect(req.headers['x-uber-app']).toBeTruthy();
    expect(req.headers['x-csrf-token']).toBeFalsy();
    req.on('data', (data) /*: void */ => {
      buff.push(data.toString());
    });
    req.on('end', () /*: void */ => {
      expect(JSON.parse(buff.join())).toStrictEqual({hello: 'world'});
      res.writeHead(200);
      res.end('OK');
    });
  });
  const proxyConnection = proxyServer.listen(proxyPort);

  // $FlowFixMe
  const appServer = http.createServer(app.callback());
  const connection = appServer.listen(appPort);

  const res = await request.post(`http://localhost:${appPort}/test/hello?a=b`, {
    headers: {
      'x-test': 'something',
      'x-hello': 'world',
      'x-csrf-token': 'lol',
    },
    json: {hello: 'world'},
  });
  expect(res).toBe('OK');
  proxyConnection.close();
  connection.close();

  // $FlowFixMe
  const m3Calls = M3.getCalls();
  expect(m3Calls[0]).toEqual([
    'timing',
    ['proxy_socket_time', m3Calls[0][1][1], {route: 'root'}],
  ]);
  expect(m3Calls[1]).toEqual([
    'timing',
    ['proxy_header_time', m3Calls[1][1][1], {status_code: 200, route: 'root'}],
  ]);
  expect(m3Calls[2]).toEqual([
    'timing',
    ['proxy_response_time', m3Calls[2][1][1], {route: 'root'}],
  ]);
});

test('x-uber-origin header handling', async () => {
  const mockCtx = {method: 'GET', headers: {'x-uber-origin': 'abcd_lol'}};
  const headers = getProxyHeaders(mockCtx);
  expect(headers).toStrictEqual({
    'x-uber-origin': 'abcd-lol,unknown-service',
    'x-uber-source': 'unknown-service',
    'x-uber-app': 'unknown-service',
  });
});

test('host header handling', async () => {
  const mockCtx = {method: 'GET', headers: {'x-uber-origin': 'abcd_lol'}};
  const headersWithHost = getProxyHeaders(mockCtx, {
    uri: 'https://this.that.com',
  });
  expect(headersWithHost).toStrictEqual({
    'x-uber-origin': 'abcd-lol,unknown-service',
    'x-uber-source': 'unknown-service',
    'x-uber-app': 'unknown-service',
    host: 'this.that.com',
  });
});

test('decider', async () => {
  const app = new App('el', el => el);
  app.enhance(SSRDeciderToken, ProxyDecider);
  app.register(ProxyConfigToken, {
    test: {
      uri: `http://localhost:1234`,
      routes: [{route: '/user/*'}, {route: '/test/*'}],
    },
    all: {uri: `http://localhost:2234`, routes: [{route: '/*'}]},
  });
  app.middleware((
    ctx /*: Context */,
    next /*: () => Promise<void> */
  ) /*: Promise<void> */ => {
    if (
      ctx.url === '/test/user/test' ||
      ctx.url === '/test/test/something' ||
      ctx.url === '/all/thing?a=b'
    ) {
      ctx.body = 'OK';
      expect(ctx.element).toBeFalsy();
    } else {
      expect(ctx.element).toBeTruthy();
    }
    return next();
  });
  const sim = getSimulator(app);
  const ctx1 = await sim.render('/');
  const ctx2 = await sim.render('/test/user/test');
  const ctx3 = await sim.render('/test/test/something');
  const ctx4 = await sim.render('/all/thing?a=b');
  expect(ctx1.element).toBeTruthy();
  expect(ctx2.element).toBeFalsy();
  expect(ctx3.element).toBeFalsy();
  expect(ctx4.element).toBeFalsy();
});
