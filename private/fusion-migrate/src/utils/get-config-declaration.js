const babylon = require('babylon');
const get = require('just-safe-get');

// TODO: Right now this only handles object configurations. It doesn't handle configs
// with primitive values or explicitly setting object configs to null in either dev or prod
module.exports = function getConfigDeclaration(config, keyPath) {
  const common = get(config.common, keyPath);
  const dev = get(config.dev, keyPath);
  const prod = get(config.prod, keyPath);
  const args = [common, dev, prod]
    .filter(c => c !== undefined)
    .map(c => {
      if (c === dev) {
        return `__DEV__ ? ${JSON.stringify(dev)} : {}`;
      } else if (c === prod) {
        return `process.env.UBER_ENVIRONMENT === 'production' ? ${JSON.stringify(
          prod
        )} : {}`;
      } else {
        return JSON.stringify(c);
      }
    })
    .join(',');
  const code = `Object.assign(${args})`;
  return babylon.parseExpression(code);
};
