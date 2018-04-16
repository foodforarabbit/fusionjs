const get = require('just-safe-get');
const babylon = require('babylon');

module.exports = config => (/*babel*/) => {
  return {
    name: 'sentry-config',
    visitor: {
      ExportDeclaration(path) {
        const {common, prod} = config;
        let sentryId =
          get(prod, 'sentry.server.dsn') ||
          get(prod, 'clients.logtron.sentry.id') ||
          get(common, 'sentry.server.dsn') ||
          get(common, 'clients.logtron.sentry.id') ||
          '';

        sentryId = sentryId.replace('uberinternal.com', 'local.uber.internal');
        path.node.declaration = babylon.parseExpression(`{id: '${sentryId}'}`);
      },
    },
  };
};
