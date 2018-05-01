const {GalileoToken} = require('@uber/fusion-plugin-galileo');
const {LoggerToken} = require('fusion-tokens');
const {TracerToken} = require('@uber/fusion-plugin-tracer');
const App = require('fusion-core').default;
const {SSRDeciderToken} = require('fusion-core');

const {getSimulator} = require('fusion-test-utils');
const getPort = require('get-port');
const http = require('http');
const request = require('request-promise');
const tape = require('tape-cup');

const {ProxyConfigToken} = require('../tokens');
const ProxyDecider = require('../decider.js');
const ProxyPlugin = require('../plugin.js');
const {getProxyHeaders} = require('../plugin.js');

function getMockTracer(t) {
  return {
    tracer: {},
    from: ctx => {
      t.ok(ctx, 'passes ctx to tracer');
      return {
        tracer: {},
        span: {},
      };
    },
  };
}

function getMockGalileo(fn) {
  return {
    galileo: {
      AuthenticateOut(proxyName, type, span, cb) {
        return fn(proxyName, type, span, cb);
      },
    },
  };
}

tape('proxies GET requests', async t => {
  const app = new App('el', el => el);
  const proxyPort = await getPort();
  const appPort = await getPort();
  app.register(ProxyPlugin);
  app.register(LoggerToken, console);
  app.register(TracerToken, getMockTracer(t));
  app.register(
    GalileoToken,
    getMockGalileo((proxyName, type, span, cb) => {
      t.equal(proxyName, 'test');
      t.equal(type, 'http');
      t.ok(span);
      t.equal(typeof cb, 'function');
      cb(null, {
        'x-test': 'test-value',
      });
    })
  );
  app.register(ProxyConfigToken, {
    test: {
      uri: `http://localhost:${proxyPort}`,
      routes: [
        {
          route: '/*',
        },
      ],
    },
  });

  const proxyServer = http.createServer((req, res) => {
    t.equal(req.url, '/hello?a=b');
    t.equal(req.headers['x-hello'], 'world');
    t.equal(req.headers['x-test'], 'test-value');
    t.ok(req.headers['x-uber-app']);
    t.notok(req.headers['x-csrf-token']);
    res.writeHead(200);
    res.end('OK');
  });
  const proxyConnection = proxyServer.listen(proxyPort);

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
  t.end();
});

tape('galileo error handling', async t => {
  const app = new App('el', el => el);
  const proxyPort = await getPort();
  const appPort = await getPort();
  app.register(ProxyPlugin);
  app.register(LoggerToken, {
    error: (message, {path}) => {
      t.equal(message, 'test error');
      t.equal(path, '/test/hello');
    },
  });
  app.register(TracerToken, getMockTracer(t));
  app.register(
    GalileoToken,
    getMockGalileo((proxyName, type, span, cb) => {
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
      routes: [
        {
          route: '/*',
        },
      ],
    },
  });

  const proxyServer = http.createServer((req, res) => {
    t.equal(req.url, '/hello?a=b');
    t.equal(req.headers['x-hello'], 'world');
    t.equal(req.headers['x-test'], 'something');
    t.ok(req.headers['x-uber-app']);
    t.notok(req.headers['x-csrf-token']);
    res.writeHead(200);
    res.end('OK');
  });
  const proxyConnection = proxyServer.listen(proxyPort);

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
  t.end();
});

tape('proxies POST requests', async t => {
  const app = new App('el', el => el);
  const proxyPort = await getPort();
  const appPort = await getPort();
  app.register(ProxyPlugin);
  app.register(LoggerToken, console);
  app.register(TracerToken, getMockTracer(t));
  app.register(
    GalileoToken,
    getMockGalileo((proxyName, type, span, cb) => {
      t.equal(proxyName, 'test');
      t.equal(type, 'http');
      t.ok(span);
      t.equal(typeof cb, 'function');
      cb(null, {
        'x-test': 'test-value',
      });
    })
  );
  app.register(ProxyConfigToken, {
    test: {
      uri: `http://localhost:${proxyPort}`,
      routes: [
        {
          route: '/*',
        },
      ],
    },
  });

  const proxyServer = http.createServer((req, res) => {
    const buff = [];
    t.equal(req.url, '/hello?a=b');
    t.equal(req.headers['x-hello'], 'world');
    t.equal(req.headers['x-test'], 'test-value');
    t.ok(req.headers['x-uber-app']);
    t.notok(req.headers['x-csrf-token']);
    req.on('data', data => {
      buff.push(data.toString());
    });
    req.on('end', () => {
      t.deepLooseEqual(JSON.parse(buff.join()), {hello: 'world'});
      res.writeHead(200);
      res.end('OK');
    });
  });
  const proxyConnection = proxyServer.listen(proxyPort);

  const appServer = http.createServer(app.callback());
  const connection = appServer.listen(appPort);

  const res = await request.post(`http://localhost:${appPort}/test/hello?a=b`, {
    headers: {
      'x-test': 'something',
      'x-hello': 'world',
      'x-csrf-token': 'lol',
    },
    json: {
      hello: 'world',
    },
  });
  t.equal(res, 'OK');
  proxyConnection.close();
  connection.close();
  t.end();
});

tape('x-uber-origin header handling', async t => {
  const mockCtx = {
    method: 'GET',
    headers: {
      'x-uber-origin': 'abcd_lol',
    },
  };
  const headers = getProxyHeaders(mockCtx);
  t.deepLooseEqual(headers, {
    'x-uber-origin': 'abcd-lol,unknown-service',
    'x-uber-source': 'unknown-service',
    'x-uber-app': 'unknown-service',
  });
  t.end();
});

tape('decider', async t => {
  const app = new App('el', el => el);
  app.enhance(SSRDeciderToken, ProxyDecider);
  app.register(ProxyConfigToken, {
    test: {
      uri: `http://localhost:1234`,
      routes: [
        {
          route: '/user/*',
        },
        {
          route: '/test/*',
        },
      ],
    },
    all: {
      uri: `http://localhost:2234`,
      routes: [
        {
          route: '/*',
        },
      ],
    },
  });
  app.middleware((ctx, next) => {
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
