// @noflow
import createXhrPlugin from '../src/plugin.js';
import {UberXhr} from '../src/index';

test('xhr get request using bind', done => {
  const {xhr, plugin} = createXhrPlugin();

  const get = xhr.get.bind(xhr);

  function mockFetch(uri, options) {
    expect(uri).toBe('/test');
    expect(options.method).toBe('GET');
    return Promise.resolve('test');
  }

  let hitFlushCb = false;

  get('/test', (err, result) => {
    hitFlushCb = true;
    expect(err).toBe(null);
    expect(result).toBe('test');
  });

  plugin.provides({fetch: mockFetch});

  get('/test', (err, result) => {
    expect(err).toBe(null);
    expect(result).toBe('test');
    expect(hitFlushCb).toBe(true);
    done();
  });
});

test('xhr post request, json true', done => {
  const {xhr, plugin} = createXhrPlugin();

  function mockFetch(uri, options) {
    expect(uri).toBe('/test');
    expect(options.body).toBe(JSON.stringify({}));
    expect(options.method).toBe('POST');
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
      expect(err).toBe(null);
      expect(result.hello).toBe('world');
      done();
    }
  );
  plugin.provides({fetch: mockFetch});
});

test('xhr put request, json object', done => {
  const {xhr, plugin} = createXhrPlugin();

  function mockFetch(uri, options) {
    expect(uri).toBe('/test');
    expect(options.body).toBe(JSON.stringify({}));
    expect(options.method).toBe('PUT');
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
      expect(err).toBe(null);
      expect(result.hello).toBe('world');
      done();
    }
  );
  plugin.provides({fetch: mockFetch});
});

test('xhr delete request, no body', done => {
  const {xhr, plugin} = createXhrPlugin();

  function mockFetch(uri, options) {
    expect(uri).toBe('/test');
    expect(options.method).toBe('DELETE');
    expect(options.headers.test).toBe('lol');
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
      expect(err).toBe(null);
      expect(result).toBe('test');
      done();
    }
  );
  plugin.provides({fetch: mockFetch});
});

test('headers, GET request', done => {
  const {xhr, plugin} = createXhrPlugin();

  function mockFetch(uri, options) {
    expect(uri).toBe('/test');
    expect(options.method).toBe('GET');
    expect(options.headers).toStrictEqual({
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
      expect(err).toBe(null);
      expect(result).toBe('test');
      done();
    }
  );
  plugin.provides({fetch: mockFetch});
});

test('headers, GET request no overrides', done => {
  const {xhr, plugin} = createXhrPlugin();

  function mockFetch(uri, options) {
    expect(uri).toBe('/test');
    expect(options.method).toBe('GET');
    expect(options.headers).toStrictEqual({
      'x-uber-origin': 'test-app',
      'x-test': 'testing',
      'x-other': 'other',
    });
    return Promise.resolve('test');
  }

  xhr.setHeaderItem('x-test', 'testing');
  xhr.setHeaderItem('x-other', 'other');
  xhr.setOrigin('test-app');

  expect(xhr.getOrigin()).toBe('test-app');
  expect(xhr.getHeader('x-other')).toBe('other');

  expect(xhr.configureRoot).toThrow();

  xhr(
    {
      uri: '/test',
      method: 'GET',
    },
    (err, result) => {
      expect(err).toBe(null);
      expect(result).toBe('test');
      done();
    }
  );
  plugin.provides({fetch: mockFetch});
});

test('xhr calling setFetch multiple times', async () => {
  const {plugin} = createXhrPlugin();

  function mockFetch() {}

  expect(() => {
    plugin.provides({fetch: mockFetch});
    plugin.provides({fetch: mockFetch});
  }).not.toThrow();
});

test('export can be called with new', async () => {
  const xhr = new UberXhr();
  expect(typeof xhr).toBe('function');
});
