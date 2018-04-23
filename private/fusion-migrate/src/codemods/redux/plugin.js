const {astOf} = require('../../utils');
const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const t = babel.types;
  const createStoreVisitor = visitNamedModule({
    t,
    moduleName: 'createStore',
    packageName: 'redux',
    refsHandler: (t, state, refPaths, path) => {
      const createStoreCall = refPaths.find(
        ref => ref.parent.type === 'CallExpression'
      ).parentPath;
      const rootReducer = createStoreCall.node.arguments[0];
      const rootReducerBinding = path.scope.getBinding(rootReducer.name).path
        .parentPath;
      path.parentPath.traverse({
        ImportDeclaration(importDeclaration) {
          if (importDeclaration !== rootReducerBinding) {
            importDeclaration.remove();
          }
        },
        ExportDefaultDeclaration(exportPath) {
          exportPath.replaceWith(
            astOf(`export default {reducer: ${rootReducer.name}}`)
          );
        },
      });
    },
  });
  return {
    name: 'redux',
    visitor: createStoreVisitor,
  };
};
