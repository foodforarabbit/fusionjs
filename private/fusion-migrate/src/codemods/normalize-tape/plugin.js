const {astOf} = require('../../utils/index.js');
const t = require('@babel/types');

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

              const args = path.node.arguments;
              // Ensure tests use BlockStatements rather than implicit return functions
              // due to an issue with jest-codemods and implicit return
              if (
                callee.type === 'Identifier' &&
                callee.name === test &&
                args.length === 2 &&
                args[1].type === 'ArrowFunctionExpression' &&
                args[1].body.type !== 'BlockStatement'
              ) {
                const oldBody = args[1].body;
                args[1].body = t.blockStatement([t.returnStatement(oldBody)]);
              }

              // if arg in `tape('desc', arg)` is not `t`, rename it to `t`
              if (
                callee.type === 'Identifier' &&
                callee.name === test &&
                args.length === 2 &&
                args[1].type.match(/FunctionExpression/) &&
                args[1].params.length === 1
              ) {
                const arg = args[1].params[0].name;
                args[1].params[0].name = 't';
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
                args.length > 1 &&
                !args[1].type.match(/FunctionExpression/)
              ) {
                const ast = astOf(`t => $()`).expression;
                ast.body.callee = args[1];
                args[1] = ast;
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
