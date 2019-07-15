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
*/

const {getSimulator} = require('fusion-test-utils');
const getPort = require('get-port');
const http = require('http');
/*::
import type {IncomingMessage, ServerResponse} from 'http';
*/
const request = require('request-promise');
const tape = require('tape-cup');

const {ProxyConfigToken} = require('../tokens');
const ProxyDecider = require('../decider.js');
const ProxyPlugin = require('../plugin.js');

// $FlowFixMe
const {getProxyHeaders} = require('../plugin.js');

function getMockTracer(
  t
) /*: {
  from: (ctx: Context) => {span: any, tracer: any},
  tracer: any,
} */ {
  return {
    tracer: {},

    from: (ctx) /*: {|span: any, tracer: any|} */ => {
      t.ok(ctx, 'passes ctx to tracer');
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

tape('proxies GET requests', async (t) /*: Promise<void> */ => {
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
        t.equal(ctx.req.m3Tags.route, 'root', 'sets route tag');
        M3 = m3;
      },
    })
  );

  app.register(ProxyPlugin);

  // $FlowFixMe
  app.register(LoggerToken, console);
  app.register(TracerToken, getMockTracer(t));
  app.register(
    GalileoToken,
    getMockGalileo((proxyName, type, span, cb) /*: void */ => {
      t.equal(proxyName, 'test');
      t.equal(type, 'http');
      t.ok(span);
      t.equal(typeof cb, 'function');
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
    t.equal(req.url, '/hello?a=b');
    t.equal(req.headers['x-hello'], 'world');
    t.equal(req.headers['x-test'], 'test-value');
    t.equal(req.headers['x-value'], 'some-value');
    t.equal(req.headers['x-next'], 'correct');
    t.ok(req.headers['x-uber-app']);
    t.notok(req.headers['x-csrf-token']);
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
  t.equal(res, 'OK');
  proxyConnection.close();
  connection.close();

  // $FlowFixMe
  const m3Calls = M3.getCalls();
  t.deepEqual(m3Calls[0], [
    'timing',
    ['proxy_socket_time', m3Calls[0][1][1], {route: 'root'}],
  ]);
  t.deepEqual(m3Calls[1], [
    'timing',
    ['proxy_header_time', m3Calls[1][1][1], {status_code: 200, route: 'root'}],
  ]);
  t.deepEqual(m3Calls[2], [
    'timing',
    ['proxy_response_time', m3Calls[2][1][1], {route: 'root'}],
  ]);
  t.end();
});

tape('galileo error handling', async (t) /*: Promise<void> */ => {
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
      t.equal(message, 'test error');
      t.equal(path, '/test/hello');
    },
  });
  app.register(TracerToken, getMockTracer(t));
  app.register(
    GalileoToken,
    getMockGalileo((proxyName, type, span, cb) /*: void */ => {
      t.equal(proxyName, 'test');
      t.equal(type, 'http');
      t.ok(span);
      t.equal(typeof cb, 'function');
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
    t.equal(req.url, '/hello?a=b');
    t.equal(req.headers['x-hello'], 'world');
    t.equal(req.headers['x-test'], 'something');
    t.ok(req.headers['x-uber-app']);
    t.notok(req.headers['x-csrf-token']);
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
  t.equal(res, 'OK');
  proxyConnection.close();
  connection.close();

  // $FlowFixMe
  const m3Calls = M3.getCalls();
  t.deepEqual(m3Calls[0], [
    'timing',
    ['proxy_socket_time', m3Calls[0][1][1], {route: 'root'}],
  ]);
  t.deepEqual(m3Calls[1], [
    'timing',
    ['proxy_header_time', m3Calls[1][1][1], {status_code: 200, route: 'root'}],
  ]);
  t.deepEqual(m3Calls[2], [
    'timing',
    ['proxy_response_time', m3Calls[2][1][1], {route: 'root'}],
  ]);
  t.end();
});

tape('proxies POST requests', async (t) /*: Promise<void> */ => {
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
  app.register(TracerToken, getMockTracer(t));
  app.register(
    GalileoToken,
    getMockGalileo((proxyName, type, span, cb) /*: void */ => {
      t.equal(proxyName, 'test');
      t.equal(type, 'http');
      t.ok(span);
      t.equal(typeof cb, 'function');
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
    t.equal(req.url, '/hello?a=b');
    t.equal(req.headers['x-hello'], 'world');
    t.equal(req.headers['x-test'], 'test-value');
    t.ok(req.headers['x-uber-app']);
    t.notok(req.headers['x-csrf-token']);
    req.on('data', (data) /*: void */ => {
      buff.push(data.toString());
    });
    req.on('end', () /*: void */ => {
      t.deepLooseEqual(JSON.parse(buff.join()), {hello: 'world'});
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
  t.equal(res, 'OK');
  proxyConnection.close();
  connection.close();

  // $FlowFixMe
  const m3Calls = M3.getCalls();
  t.deepEqual(m3Calls[0], [
    'timing',
    ['proxy_socket_time', m3Calls[0][1][1], {route: 'root'}],
  ]);
  t.deepEqual(m3Calls[1], [
    'timing',
    ['proxy_header_time', m3Calls[1][1][1], {status_code: 200, route: 'root'}],
  ]);
  t.deepEqual(m3Calls[2], [
    'timing',
    ['proxy_response_time', m3Calls[2][1][1], {route: 'root'}],
  ]);
  t.end();
});

tape('x-uber-origin header handling', async (t) /*: Promise<void> */ => {
  const mockCtx = {method: 'GET', headers: {'x-uber-origin': 'abcd_lol'}};
  const headers = getProxyHeaders(mockCtx);
  t.deepLooseEqual(headers, {
    'x-uber-origin': 'abcd-lol,unknown-service',
    'x-uber-source': 'unknown-service',
    'x-uber-app': 'unknown-service',
  });
  t.end();
});

tape('host header handling', async (t) /*: Promise<void> */ => {
  const mockCtx = {method: 'GET', headers: {'x-uber-origin': 'abcd_lol'}};
  const headersWithHost = getProxyHeaders(mockCtx, {
    uri: 'https://this.that.com',
  });
  t.deepLooseEqual(headersWithHost, {
    'x-uber-origin': 'abcd-lol,unknown-service',
    'x-uber-source': 'unknown-service',
    'x-uber-app': 'unknown-service',
    host: 'this.that.com',
  });
  t.end();
});

tape('decider', async (t) /*: Promise<void> */ => {
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
      t.notok(ctx.element);
    } else {
      t.ok(ctx.element);
    }
    return next();
  });
  const sim = getSimulator(app);
  const ctx1 = await sim.render('/');
  const ctx2 = await sim.render('/test/user/test');
  const ctx3 = await sim.render('/test/test/something');
  const ctx4 = await sim.render('/all/thing?a=b');
  t.ok(ctx1.element);
  t.notok(ctx2.element);
  t.notok(ctx3.element);
  t.notok(ctx4.element);
  t.end();
});
