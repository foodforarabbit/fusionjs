const {
  addStatementAfter,
  matchStatement,
  replaceExpression,
} = require('../../utils/index.js');

module.exports = () => {
  return {
    name: 'server-simulator-tests',
    visitor: {
      ImportDeclaration(path, state) {
        if (path.node.source.value === 'tape') {
          const test = path.node.specifiers[0].local.name;
          addStatementAfter(
            path,
            `import {getSimulator} from 'fusion-test-utils'`
          );
          const filename = state.file.opts.filename;
          const rest = filename.match(/\/src\/(.+)/)[1];
          const rel = new Array(rest.match(/\//g).length).fill('..').join('/');
          // app is a common enough variable name that we should use a generated identifier
          const {name} = path.scope.generateUidIdentifier('app');
          addStatementAfter(
            path,
            `import {default as ${name}} from '${rel}/main'`
          );

          path.parentPath.traverse({
            CallExpression(path) {
              if (
                path.node.callee.type === 'Identifier' &&
                path.node.callee.name === test &&
                path.node.arguments.length === 2 &&
                path.node.arguments[0].type === 'StringLiteral'
              ) {
                const arg = path.node.arguments[0];
                if (arg.value.match(/^application server$/i)) {
                  path.remove();
                }
                if (arg.value.match(/^Health Endpoint$/i)) {
                  const simulatorHealthTest = `
                    test(${arg.extra.raw}, async () => {
                      __BEFORE__;
                      const sim = getSimulator(await ${name}());
                      const ctx = await sim.request('/health');
                      expect(ctx.status).toBe(200);
                      __AFTER__;
                    })
                  `;
                  migrateModifications(path, simulatorHealthTest);
                }
                if (arg.value.match(/^SPA Endpoint$/i)) {
                  const simulatorEndpointTest = `
                    test(${arg.extra.raw}, async () => {
                      __BEFORE__;
                      const sim = getSimulator(await ${name}());
                      const ctx = await sim.request('/');
                      expect(ctx.status).toBe(302);
                      __AFTER__;
                    })
                  `;
                  migrateModifications(path, simulatorEndpointTest);
                }
              }
            },
          });
        }
      },
    },
  };
};

function migrateModifications(path, template) {
  let first;
  let last;
  path.traverse({
    VariableDeclaration(path) {
      if (path.node.declarations[0].id.name === 'server') {
        first = path;
      }
    },
    ExpressionStatement(path) {
      if (matchStatement(path, `t.end()`)) {
        last = path;
      }
    },
  });
  if (first && last) {
    replaceExpression(path, template);
    path.traverse({
      ExpressionStatement(path) {
        if (path.node.expression.type === 'Identifier') {
          if (path.node.expression.name === '__BEFORE__') {
            const firstIndex = first.parentPath.node.body.indexOf(first.node);
            const slice = first.parentPath.node.body.slice(0, firstIndex);
            const targetIndex = path.parentPath.node.body.indexOf(path.node);
            path.parentPath.node.body.splice(targetIndex, 0, ...slice);
            path.remove();
          } else if (path.node.expression.name === '__AFTER__') {
            const lastIndex = last.parentPath.node.body.indexOf(last.node);
            const slice = last.parentPath.node.body.slice(0, lastIndex);
            const targetIndex = path.parentPath.node.body.indexOf(path.node);
            path.parentPath.node.body.splice(targetIndex, 0, ...slice);
            path.remove();
          }
        }
      },
    });
  }
}
