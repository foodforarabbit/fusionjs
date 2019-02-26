const composeVisitors = require('../../utils/compose-visitors.js');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const getRegisterExpression = require('../../utils/get-register-expression.js');
const visitNewAppExpression = require('../../utils/visit-new-app-expression.js');

module.exports = ({pageSkeletonConfig}) => babel => {
  const t = babel.types;
  const appVisitor = visitNewAppExpression(t, (t, state, refPath) => {
    refPath.parentPath.parentPath.parentPath.parentPath.traverse({
      IfStatement(path) {
        if (path.node.test.name === '__NODE__') {
          path.node.consequent.body.push(
            getRegisterExpression('RenderToken', 'PageSkeletonRenderer')
          );

          path.node.consequent.body.push(
            getRegisterExpression('PageSkeletonConfigToken', pageSkeletonConfig)
          );
        }
      },
    });
  });

  const importVisitor = {
    Program(path) {
      const body = path.node.body;
      ensureImportDeclaration(body, `import {RenderToken} from 'fusion-core'`);
      ensureImportDeclaration(
        body,
        `import PageSkeletonRenderer, {PageSkeletonConfigToken} from '@uber/fusion-plugin-page-skeleton-compat';`
      );
    },
  };

  return {
    name: 'compat-plugin-render-page-skeleton',
    visitor: composeVisitors(appVisitor, importVisitor),
  };
};
