const {astOf} = require('../../utils/index.js');
const visitNamedModule = require('../../utils/visit-named-module.js');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const getProgram = require('../../utils/get-program.js');

module.exports = () => {
  const errorHandlerVisitor = visitNamedModule({
    packageName: '@uber/fusion-plugin-secure-headers',
    refsHandler(t, state, refPaths) {
      const ref = refPaths.find(p => p.parentPath.type === 'CallExpression');
      if (!ref) {
        throw new Error('Could not find registration of uber error handler');
      }
      ref.parentPath.insertAfter(astOf(`app.register(HttpHandlerPlugin);`));
      ref.parentPath.insertAfter(
        astOf(`app.register(HttpHandlerToken, createPlugin({
              deps: {server: BedrockCompatToken},
              provides: ({server}) => server.app,
            }))`)
      );
      ref.parentPath.insertAfter(
        astOf(
          `app.register(InitializeServerToken, require('./server/index.js').default);`
        )
      );
      ref.parentPath.insertAfter(
        astOf(`app.register(BedrockCompatToken, BedrockCompatPlugin);`)
      );

      const body = getProgram(refPaths[0]).node.body;
      ensureImportDeclaration(
        body,
        `import BedrockCompatPlugin, {InitializeServerToken, BedrockCompatToken} from '@uber/fusion-plugin-bedrock-compat'`
      );
      ensureImportDeclaration(
        body,
        `import HttpHandlerPlugin, {HttpHandlerToken} from 'fusion-plugin-http-handler'`
      );
    },
  });

  return {
    name: 'compat-plugin-http-handler',
    visitor: errorHandlerVisitor,
  };
};
