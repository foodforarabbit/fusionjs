/* global exports */
import Atreyu from '@uber/atreyu';

exports.meta = {
  name: 'atreyu',
  dependencies: ['config', 'logger', 'tracer', 'galileo']
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
    config.get('clients.atreyu.enabled');
  let atreyuClient;

  if (enabled) {
    const atreyuConfig = Object.assign(
      {env: server.env},
      config.get('clients.atreyu')
    );
    const appConfig = {
      m3: server.statsd,
      logger: server.logger.createChild('atreyu'),
      galileo: clients.galileo || server.clients.galileo,
      tracer: clients.tracer || server.clients.tracer,
      channelsOnInit: true
    };

    atreyuClient = new Atreyu(atreyuConfig, appConfig);
  }

  return Promise.resolve(atreyuClient);
};
