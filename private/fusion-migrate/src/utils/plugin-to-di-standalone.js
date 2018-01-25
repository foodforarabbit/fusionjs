const compose = require('./compose');
const bump = require('./bump-version');

// migrates plugins with no dependencies and no return value
// app.plugin(Foo) -> app.register(Foo)
module.exports = name => ({source}, {jscodeshift: j}) => {
  return j(source)
    .find(j.CallExpression, {
      callee: {object: {name: 'app'}, property: {name: 'plugin'}},
      arguments: [{name}],
    })
    .replaceWith(p => {
      return j.callExpression(
        j.memberExpression(j.identifier('app'), j.identifier('register')),
        [j.identifier(name)]
      );
    })
    .toSource();
};
