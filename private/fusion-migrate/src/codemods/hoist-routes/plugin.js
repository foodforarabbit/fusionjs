const {astOf} = require('../../utils');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const getProgram = require('../../utils/get-program.js');

const compatModules = ['Route', 'Redirect'];
module.exports = routePrefix => babel => {
  const t = babel.types;
  routePrefix = stripLeadingSlash(routePrefix);
  return {
    name: 'hoist-routes',
    visitor: {
      ImportDeclaration(path) {
        // removes react-router imports
        if (path.node.source.value === 'react-router') {
          path.remove();
        }
      },
      ExportDefaultDeclaration(path, state) {
        // This is required because modifying the export declaration causes it to revisit the node
        if (state.didHoistRoutes) {
          return;
        }
        state.didHoistRoutes = true;
        const program = getProgram(path);
        const body = program.node.body;
        ensureImportDeclaration(
          body,
          `import {Redirect} from 'fusion-plugin-react-router'`
        );
        ensureImportDeclaration(
          body,
          `import {Route} from 'fusion-plugin-react-router'`
        );
        ensureImportDeclaration(
          body,
          `import {Switch} from 'fusion-plugin-react-router'`
        );
        const routesIdentifier = path.scope.generateUidIdentifier('routes');
        path.traverse({
          JSXIdentifier(jsxPath) {
            if (
              routePrefix &&
              jsxPath.parent.type === 'JSXAttribute' &&
              compatModules.includes(jsxPath.parentPath.parent.name.name)
            ) {
              // Messing around with paths to play nicely with route prefixes
              const parentName = jsxPath.parentPath.parent.name.name;
              if (
                parentName == 'Route' &&
                jsxPath.node.name === 'path' &&
                // Ensures we only act on the top level <Route> component, not nested routes
                jsxPath.parentPath.parentPath.parentPath.parent.type !==
                  'JSXElement' &&
                jsxPath.parent.value.type === 'StringLiteral'
              ) {
                // Remove route prefix if exists on top level <Route path="">
                const routePath = stripLeadingSlash(jsxPath.parent.value.value);
                if (routePath === routePrefix) {
                  jsxPath.parent.value.value = '/';
                }
              }
            }
          },
        });

        if (path.node.declaration.type !== 'FunctionDeclaration') {
          // handles case where routes are exported directly, not `getRoutes` function
          path.insertAfter(
            t.VariableDeclaration('const', [
              t.VariableDeclarator(routesIdentifier, path.node.declaration),
            ])
          );
        } else {
          // hoists routes out of `getRoutes` function
          let replacedReturn = false;
          path.traverse({
            ReturnStatement(returnPath) {
              if (replacedReturn) return;
              replacedReturn = true;
              returnPath.replaceWith(
                t.VariableDeclaration('const', [
                  t.VariableDeclarator(
                    routesIdentifier,
                    returnPath.node.argument
                  ),
                ])
              );
            },
          });
          path.parent.body = path.parent.body.concat(
            path.node.declaration.body.body
          );
        }
        let routesPath = null;
        path.parentPath.traverse({
          VariableDeclaration(declarationPath) {
            if (declarationPath.node.declarations[0].id === routesIdentifier) {
              routesPath = declarationPath;
              declarationPath.insertBefore();
            }
          },
        });
        path.remove();
        routesPath.insertAfter(
          astOf(`export default ${routesIdentifier.name};`)
        );
      },
    },
  };
};

function stripLeadingSlash(str) {
  if (str && str.startsWith('/')) {
    return str.substring(1);
  }
  return str;
}
