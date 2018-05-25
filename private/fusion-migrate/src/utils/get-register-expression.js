const t = require('@babel/types');

module.exports = function getRegisterExpression(token, plugin) {
  if (typeof token === 'string') {
    token = t.identifier(token);
  }
  if (typeof plugin === 'string') {
    plugin = t.identifier(plugin);
  }
  return t.callExpression(
    t.memberExpression(t.identifier('app'), t.identifier('register')),
    [token, plugin]
  );
};
