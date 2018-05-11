const {astOf} = require('../../utils/index.js');

module.exports = () => {
  return {
    name: 'normalize-tape',
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === 'tape') {
          const test = path.node.specifiers[0].local.name;
          path.parentPath.traverse({
            CallExpression(path) {
              const callee = path.node.callee;

              // if arg in `tape('desc', arg)` is not `t`, rename it to `t`
              if (
                callee.type === 'Identifier' &&
                callee.name === test &&
                path.node.arguments.length === 2 &&
                path.node.arguments[1].type.match(/FunctionExpression/) &&
                path.node.arguments[1].params.length === 1
              ) {
                const arg = path.node.arguments[1].params[0].name;
                path.node.arguments[1].params[0].name = 't';
                path.traverse({
                  Identifier(path) {
                    if (path.node.name === arg) path.node.name = 't';
                  },
                });
              }

              // if arg is higher order function, ensure it doesn't pollute the
              // callback's `fn.length` (which would timeout under jest)
              if (
                callee.type === 'Identifier' &&
                callee.name === test &&
                !path.node.arguments[1].type.match(/FunctionExpression/)
              ) {
                const ast = astOf(`t => $()`).expression;
                ast.body.callee = path.node.arguments[1];
                path.node.arguments[1] = ast;
              }
            },
          });
        }
      },
      ExpressionStatement(path) {
        // jest-codemod of t.fail times out if t.fail is inside conditional
        // t.fail(error) => throw new Error(error)
        const expression = path.node.expression;
        if (
          expression.type === 'CallExpression' &&
          expression.callee.type === 'MemberExpression' &&
          expression.callee.object.type === 'Identifier' &&
          expression.callee.object.name === 't' &&
          expression.callee.property.type === 'Identifier' &&
          expression.callee.property.name === 'fail'
        ) {
          const ast = astOf(`throw new Error($)`);
          ast.argument.arguments[0] = expression.arguments[0];
          path.replaceWith(ast);
        }
      },
    },
  };
};
