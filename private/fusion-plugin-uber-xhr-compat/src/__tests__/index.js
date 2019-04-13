// @noflow
import tape from 'tape-cup';
import createXhrPlugin from '../plugin.js';
import {UberXhr} from '../index';

tape('xhr get request using bind', t => {
  const {xhr, plugin} = createXhrPlugin();

  const get = xhr.get.bind(xhr);

  function mockFetch(uri, options) {
    t.equal(uri, '/test');
    t.equal(options.method, 'GET');
    return Promise.resolve('test');
  }

  let hitFlushCb = false;

  get('/test', (err, result) => {
    hitFlushCb = true;
    t.equal(err, null);
    t.equal(result, 'test');
  });

  plugin.provides({fetch: mockFetch});

  get('/test', (err, result) => {
    t.equal(err, null);
    t.equal(result, 'test');
    t.equal(hitFlushCb, true);
    t.end();
  });
});

tape('xhr post request, json true', t => {
  const {xhr, plugin} = createXhrPlugin();

  function mockFetch(uri, options) {
    t.equal(uri, '/test');
    t.equal(options.body, JSON.stringify({}));
    t.equal(options.method, 'POST');
    return Promise.resolve({
      json: () => ({
        hello: 'world',
      }),
    });
  }

  xhr.post(
    {
      uri: '/test',
      json: true,
      body: {},
    },
    (err, result) => {
      t.equal(err, null);
      t.equal(result.hello, 'world');
      t.end();
    }
  );
  plugin.provides({fetch: mockFetch});
});

tape('xhr put request, json object', t => {
  const {xhr, plugin} = createXhrPlugin();

  function mockFetch(uri, options) {
    t.equal(uri, '/test');
    t.equal(options.body, JSON.stringify({}));
    t.equal(options.method, 'PUT');
    return Promise.resolve({
      json: () => ({
        hello: 'world',
      }),
    });
  }

  xhr.put(
    {
      uri: '/test',
      json: {},
    },
    (err, result) => {
      t.equal(err, null);
      t.equal(result.hello, 'world');
      t.end();
    }
  );
  plugin.provides({fetch: mockFetch});
});

tape('xhr delete request, no body', t => {
  const {xhr, plugin} = createXhrPlugin();

  function mockFetch(uri, options) {
    t.equal(uri, '/test');
    t.equal(options.method, 'DELETE');
    t.equal(options.headers['test'], 'lol');
    return Promise.resolve('test');
  }

  xhr.delete(
    {
      uri: '/test',
      headers: {
        test: 'lol',
      },
    },
    (err, result) => {
      t.equal(err, null);
      t.equal(result, 'test');
      t.end();
    }
  );
  plugin.provides({fetch: mockFetch});
});

tape('headers, GET request', t => {
  const {xhr, plugin} = createXhrPlugin();

  function mockFetch(uri, options) {
    t.equal(uri, '/test');
    t.equal(options.method, 'GET');
    t.deepLooseEqual(options.headers, {
      'x-uber-origin': 'test-app',
      'x-test': 'testing',
      'x-other': 'something',
      'x-lol': 'lol',
    });
    return Promise.resolve('test');
  }

  xhr.setHeaderItem('x-test', 'testing');
  xhr.setHeaderItem('x-other', 'other');
  xhr.setOrigin('test-app');

  xhr.get(
    {
      uri: '/test',
      headers: {
        'x-other': 'something',
        'x-lol': 'lol',
      },
    },
    (err, result) => {
      t.equal(err, null);
      t.equal(result, 'test');
      t.end();
    }
  );
  plugin.provides({fetch: mockFetch});
});

tape('headers, GET request no overrides', t => {
  const {xhr, plugin} = createXhrPlugin();

  function mockFetch(uri, options) {
    t.equal(uri, '/test');
    t.equal(options.method, 'GET');
    t.deepLooseEqual(options.headers, {
      'x-uber-origin': 'test-app',
      'x-test': 'testing',
      'x-other': 'other',
    });
    return Promise.resolve('test');
  }

  xhr.setHeaderItem('x-test', 'testing');
  xhr.setHeaderItem('x-other', 'other');
  xhr.setOrigin('test-app');

  t.equal(xhr.getOrigin(), 'test-app');
  t.equal(xhr.getHeader('x-other'), 'other');

  t.throws(xhr.configureRoot);

  xhr(
    {
      uri: '/test',
      method: 'GET',
    },
    (err, result) => {
      t.equal(err, null);
      t.equal(result, 'test');
      t.end();
    }
  );
  plugin.provides({fetch: mockFetch});
});

tape('xhr calling setFetch multiple times', async t => {
  const {plugin} = createXhrPlugin();

  function mockFetch() {}

  t.doesNotThrow(() => {
    plugin.provides({fetch: mockFetch});
    plugin.provides({fetch: mockFetch});
  });

  t.end();
});

tape('export can be called with new', async t => {
  const xhr = new UberXhr();
  t.equal(typeof xhr, 'function', 'returns a function from the constructor');
  t.end();
});
