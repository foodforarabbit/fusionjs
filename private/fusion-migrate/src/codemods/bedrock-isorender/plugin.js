const chalk = require('chalk');
const log = require('../../log.js');
const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const t = babel.types;

  const visitor = visitNamedModule({
    t,
    packageName: '@uber/isorender',
    refsHandler: (t, state, refPaths, path) => {
      path.remove();
      if (refPaths.length !== 1) {
        throw new Error(
          `Expected 1 reference to Isorender. Found ${refPaths.length}`
        );
      }
      const refPath = refPaths[0];
      if (refPath.parentPath.type !== 'NewExpression') {
        throw new Error(
          `Unsure how to codemod isorender. Expected NewExpression, received ${
            refPath.parentPath.type
          }`
        );
      }
      const props = refPath.parent.arguments[0].properties;

      if (refPath.parentPath.parentPath.type === 'VariableDeclarator') {
        // remove catch all handler
        const isorenderHandleRequestRef =
          refPath.scope.bindings[refPath.parentPath.parentPath.node.id.name]
            .referencePaths[0];
        isorenderHandleRequestRef.parentPath.parentPath.parentPath.parentPath.remove();
      } else {
        // TODO: We could maybe add a codemod to look for `isorender.handleRequest` for this case
        log(chalk.red('WARNING: Unable to successfully remove isorender'));
      }

      // remove refs to all params to isorender
      props.forEach(prop => {
        if (prop.value.type === 'Identifier') {
          const binding = refPath.scope.getBinding(prop.value.name);
          binding.path.parentPath.remove();
        }
      });
      refPath.parentPath.parentPath.remove();
      // This isn't super robust, but a more robust solution is pretty hard
      if (refPath.scope.bindings.webRpc) {
        const importName =
          refPath.scope.bindings.webRpc.path.node.init.callee.name;
        path.scope.bindings[importName].path.parentPath.remove();
        refPath.scope.bindings.webRpc.path.remove();
      }
      // Also not super robust, but good enough for now
      if (
        path.scope.bindings.Root &&
        path.scope.bindings.Root.referencePaths.length <= 1
      ) {
        path.scope.bindings.Root.path.parentPath.remove();
      }
    },
  });
  return {
    name: 'bedrock-isorender',
    visitor,
  };
};
