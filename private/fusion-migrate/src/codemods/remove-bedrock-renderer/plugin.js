const chalk = require('chalk');
const composeVisitors = require('../../utils/compose-visitors.js');
const findParent = require('../../utils/find-parent.js');
const log = require('../../log.js');
const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = () => {
  const isorenderVisitor = visitNamedModule({
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
          `Unsure how to codemod isorender. Expected NewExpression, received ${refPath.parentPath.type}`
        );
      }
      const props = refPath.parent.arguments[0].properties;

      if (refPath.parentPath.parentPath.type === 'VariableDeclarator') {
        // remove catch all handler
        const isorenderHandleRequestRef =
          refPath.scope.bindings[refPath.parentPath.parentPath.node.id.name]
            .referencePaths[0];
        const root =
          isorenderHandleRequestRef.parentPath.parentPath.parentPath.parentPath;
        if (root.parentPath.type !== 'FunctionDeclaration') {
          isorenderHandleRequestRef.parentPath.parentPath.parentPath.parentPath.remove();
        } else {
          throw new Error(
            `Remove @uber/isorender import and isorender.handleRequest call manually in ${state.file.opts.filename}`
          );
        }
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
      refPath.parentPath.parentPath.remove();
    },
  });

  const pageSkeletonVisitor = visitNamedModule({
    packageName: '@uber/render-page-skeleton',
    refsHandler: (t, state, refPaths, path) => {
      refPaths.forEach(refPath => {
        removeRouteHandler(refPath, path);
      });
      path.remove();
    },
  });
  return {
    name: 'remove-bedrock-renderer',
    visitor: composeVisitors(isorenderVisitor, pageSkeletonVisitor),
  };
};

function removeRouteHandler(refPath, topPath) {
  const parentCallExpression = findParent(refPath.parentPath, 'CallExpression');
  const parentDeclaration =
    findParent(refPath, 'FunctionDeclaration') ||
    findParent(refPath, 'VariableDeclarator');
  if (parentCallExpression && isServerGet(parentCallExpression)) {
    parentCallExpression.remove();
  } else if (parentDeclaration) {
    const id = parentDeclaration.node.id.name;
    const binding = topPath.scope.bindings[id];
    if (binding) {
      const refPaths = binding.referencePaths;
      refPaths.forEach(path => {
        if (
          path.parentPath.type === 'CallExpression' &&
          isServerGet(path.parentPath)
        ) {
          path.parentPath.remove();
        }
      });
    }
    parentDeclaration.remove();
  }
}

function isServerGet(path) {
  const callee = path.node.callee;
  return (
    callee.type === 'MemberExpression' &&
    callee.object.name === 'server' &&
    callee.property.name === 'get'
  );
}
