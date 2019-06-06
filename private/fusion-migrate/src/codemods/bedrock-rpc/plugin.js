const {astOf} = require('../../utils');
const {replaceExpression} = require('../../utils/index.js');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const getProgram = require('../../utils/get-program.js');
const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const t = babel.types;
  const namedModuleVisitor = visitNamedModule({
    t,
    packageName: '@uber/bedrock/web-rpc',
    refsHandler: (t, state, refPaths, importPath) => {
      const refPath = refPaths.find(ref => {
        return (
          ref.parentPath.parent.type === 'CallExpression' &&
          ref.parent.type === 'MemberExpression' &&
          ref.parent.property.name === 'init'
        );
      });
      if (!refPath) {
        return;
      }
      const methodsName = refPath.parentPath.parent.arguments[0].name;
      replaceExpression(
        refPath.parentPath.parentPath.parentPath,
        getCompatSource(methodsName)
      );
      refPath.parentPath.parentPath.parentPath.insertAfter(
        t.returnStatement(t.identifier(methodsName))
      );
      importPath.parentPath.traverse({
        ExportDefaultDeclaration(path) {
          if (path.node.declaration.type.match('Function')) {
            const declaration = path.node.declaration;
            let fnName;
            if (!declaration.id) {
              fnName = 'getRPCHandlers';
              if (declaration.type === 'FunctionDeclaration') {
                declaration.id = t.identifier(fnName);
                path.replaceWith(path.node.declaration);
              } else {
                path.replaceWith(
                  t.VariableDeclaration('const', [
                    t.VariableDeclarator(t.identifier(fnName), declaration),
                  ])
                );
              }
            } else {
              fnName = path.node.declaration.id.name;
              path.replaceWith(path.node.declaration);
            }
            path.insertAfter(astOf(getPluginSrc(fnName)));
          }
        },
      });
      const body = getProgram(refPath).node.body;
      ensureImportDeclaration(body, `import {createPlugin} from 'fusion-core'`);
      ensureImportDeclaration(
        body,
        `import {ResponseError} from 'fusion-plugin-rpc-redux-react'`
      );
      ensureImportDeclaration(
        body,
        `import {BedrockCompatToken} from '@uber/fusion-plugin-bedrock-compat'`
      );
      importPath.remove();
    },
  });
  return {
    name: 'bedrock-rpc',
    visitor: {
      ...namedModuleVisitor,
    },
  };
};

const getCompatSource = methods => {
  return `
  // This wraps the web-rpc methods to make them compatible with the new fusion promise API
  // You may want to migrate away from the old callback interface and remove this compat layer
  Object.keys(${methods}).forEach(method => {
    const oldMethod =${methods}[method];
    ${methods}[method] = (args, ctx) => {
      const req = ctx.req;
      req.body = args;
      return new Promise((resolve, reject) => {
        return oldMethod(req, resolve, reject);
      }).catch(e => {
        const error = new ResponseError(e.message);
        // TODO: you can add error.code and error.meta properties here if you want additional data to be serialized
        throw error;
      });
    };
  });
`;
};

function getPluginSrc(fnName) {
  return `
  export default createPlugin({
    deps: {
      server: BedrockCompatToken,
    },
    provides: ({server}) => ${fnName}(server)
  })`;
}
