/* global exports */
const Galileo = require('@uber/galileo');
const {opentracing} = require('jaeger-client');

exports.meta = {
  name: 'galileo',
  dependencies: ['config', 'logger', 'tracer']
};

// eslint-disable-next-line no-unused-vars
exports.register = function register({server, config, clients}) {
  if (!server) {
    throw new Error('options.server is a required parameter');
  }
  if (!config) {
    throw new Error('options.config is a required parameter');
  }
  if (!clients) {
    throw new Error('options.clients is a required parameter');
  }

  const enabled =
    config.get('clients.tracer.enabled') &&
    config.get('clients.galileo.enabled');
  const mock = config.get('clients.galileo.mock');

  let galileoClient;
  if (enabled && !mock) {
    const logger = server.logger.createChild('galileo');
    const appName =
      config.get('clients.galileo.appName') || config.get('meta.project');

    const galileoConfig = {
      appName,
      galileo: config.get('clients.galileo.config') || {}
    };

    galileoClient = new Galileo(
      galileoConfig,
      clients.tracer,
      opentracing.FORMAT_HTTP_HEADERS,
      logger
    );
  }
  return Promise.resolve(galileoClient);
};
