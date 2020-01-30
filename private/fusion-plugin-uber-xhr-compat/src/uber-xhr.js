// @noflow
const supportedMethods = ['get', 'put', 'post', 'patch', 'delete'];
export default function getXhr() {
  let flushed = false;
  const request = createBatchFn();
  supportedMethods.forEach(method => {
    request[method] = createBatchFn();
  });
  const headers = {};

  request.setHeaderItem = request.setHeader = function setHeader(key, value) {
    headers[key] = value;
  };

  request.setOrigin = function setOrigin(name) {
    headers['x-uber-origin'] = name;
  };

  request.getOrigin = function setOrigin() {
    return headers['x-uber-origin'];
  };

  request.getHeader = function getHeader(name) {
    return headers[name];
  };

  request.configureRoot = function configureRoot() {
    throw new Error(
      'configureRoot is not implemented in fusion-plugin-uber-xhr-compat. Please reach out to Web Platform for help.'
    );
  };

  request.setFetch = function setFetch(fetch) {
    if (flushed) return;
    flushed = true;

    function requestWithMethod(method) {
      return function req(uri, cb) {
        let options = {
          method: method.toUpperCase(),
          headers,
        };
        if (typeof uri === 'object') {
          options = {
            ...options,
            ...uri,
            headers: {
              ...options.headers,
              ...(uri.headers || {}),
            },
          };
          uri = options.uri || options.url;
        }
        if (options.json) {
          options.headers['content-type'] = 'application/json';
          options.headers.accept = 'application/json';
          if (typeof options.json === 'object') {
            options.body = JSON.stringify(options.json);
          } else {
            options.body = JSON.stringify(options.body);
          }
        }
        return fetch(uri, options)
          .then(result => {
            if (options.json) {
              return result.json();
            }
            return result;
          })
          .then(finalResult => {
            return cb(null, finalResult);
          })
          .catch(cb);
      };
    }
    supportedMethods.forEach(method => {
      const requestMethod = requestWithMethod(method);
      request[method].flush(requestMethod);
      request[method] = requestMethod;
    });
    request.flush(requestWithMethod('get'));
  };
  return request;
}

function createBatchFn() {
  let batch = [];
  let fn = (...args) => {
    batch.push(args);
  };
  function batchFn(...args) {
    return fn(...args);
  }
  batchFn.flush = flushFn => {
    batch.forEach(args => {
      flushFn(...args);
    });
    batch = [];
    fn = flushFn;
  };
  return batchFn;
}
