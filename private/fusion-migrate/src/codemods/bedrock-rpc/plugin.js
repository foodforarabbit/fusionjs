const {replaceExpression} = require('../../utils/index.js');
const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const t = babel.types;
  const namedModuleVisitor = visitNamedModule({
    t,
    packageName: '@uber/bedrock/web-rpc',
    refsHandler: (t, state, refPaths, importPath) => {
      if (refPaths.length !== 1) {
        throw new Error(
          'Could not codemod web-rpc - only expected one ref path to WebRPC'
        );
      }
      const refPath = refPaths[0];
      if (refPath.parentPath.parent.type !== 'CallExpression') {
        throw new Error(
          `Could not codemod web-rpc - expected call expression RPC.init. Instead got ${
            refPath.parentPath.type
          }`
        );
      }
      const methodsName = refPath.parentPath.parent.arguments[0].name;
      replaceExpression(
        refPath.parentPath.parentPath.parentPath,
        getCompatSource(methodsName)
      );
      refPath.parentPath.parentPath.parentPath.insertAfter(
        t.returnStatement(t.identifier(methodsName))
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
  return `Object.keys(${methods}).forEach(method => {
    const oldMethod =${methods}[method];
    ${methods}[method] = (args, ctx) => {
      const req = ctx.req;
      req.body = args;
      return new Promise((resolve, reject) => {
        return oldMethod(req, resolve, reject);
      });
    };
  });
`;
};
