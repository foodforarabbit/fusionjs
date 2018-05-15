const {join} = require('path');
const {astOf} = require('../../utils');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');

const compatModules = ['Route', 'IndexRoute', 'Redirect', 'IndexRedirect'];
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
        ensureImportDeclaration(
          path.parent.body,
          `import {Router4Compat} from '@uber/fusion-plugin-react-router-v3-compat';`
        );
        const routesIdentifier = path.scope.generateUidIdentifier('routes');
        path.traverse({
          JSXIdentifier(jsxPath) {
            if (
              jsxPath.parent.type === 'JSXOpeningElement' ||
              jsxPath.parent.type === 'JSXClosingElement'
            ) {
              // Renames compatModules to V3
              if (compatModules.includes(jsxPath.node.name)) {
                jsxPath.node.name = jsxPath.node.name + 'V3';
                ensureImportDeclaration(
                  path.parent.body,
                  `import {${
                    jsxPath.node.name
                  }} from '@uber/fusion-plugin-react-router-v3-compat';`
                );
              }
            } else if (
              routePrefix &&
              jsxPath.parent.type === 'JSXAttribute' &&
              compatModules.includes(
                jsxPath.parentPath.parent.name.name.replace('V3', '')
              )
            ) {
              // Messing around with paths to play nicely with route prefixes
              const parentName = jsxPath.parentPath.parent.name.name.replace(
                'V3',
                ''
              );
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
              } else if (
                ['Redirect', 'IndexRedirect'].includes(parentName) &&
                jsxPath.node.name === 'to' &&
                jsxPath.parent.value.type === 'StringLiteral'
              ) {
                // Adds routePrefix to RedirectV3 and IndexRedirectV3 components
                jsxPath.parent.value.value = join(
                  '/',
                  routePrefix,
                  jsxPath.parent.value.value
                );
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
          path.traverse({
            ReturnStatement(returnPath) {
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
        // Updates export to use <Route4Compat>
        path.parentPath.traverse({
          VariableDeclaration(declarationPath) {
            if (declarationPath.node.declarations[0].id === routesIdentifier) {
              declarationPath.insertAfter(
                astOf(
                  `export default <Router4Compat v3Routes={[${
                    routesIdentifier.name
                  }]} />`
                )
              );
            }
          },
        });
        path.remove();
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
