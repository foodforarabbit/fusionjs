const babylon = require('babylon');
const get = require('just-safe-get');

// TODO: Right now this only handles object configurations. It doesn't handle configs
// with primitive values or explicitly setting object configs to null in either dev or prod
module.exports = function getConfigDeclaration(config, keyPath) {
  const common = get(config.common, keyPath);
  const dev = get(config.dev, keyPath);
  const prod = get(config.prod, keyPath);

  const args = [common, dev, prod]
    .map((c, index) => {
      if (c === undefined || c === null) {
        return c;
      }
      if (index === 0) {
        return JSON.stringify(c);
      } else if (index === 1) {
        return `__DEV__ ? ${JSON.stringify(dev)} : {}`;
      } else {
        return `process.env.UBER_ENVIRONMENT === 'production' ? ${JSON.stringify(
          prod
        )} : {}`;
      }
    })
    .filter(Boolean);
  const code = args.length === 1 ? args[0] : `Object.assign(${args.join(',')})`;
  return babylon.parseExpression(code);
};
