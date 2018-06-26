const {addStatementAfter, astOf} = require('../../utils/index.js');
const composeVisitors = require('../../utils/compose-visitors.js');
const visitNamedModule = require('../../utils/visit-named-module.js');

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
    },
  });

  const importVisitor = {
    ImportDeclaration(path) {
      const sourceName = path.node.source.value;
      if (sourceName === 'fusion-core') {
        addStatementAfter(
          path,
          `import HttpHandlerPlugin, {HttpHandlerToken} from 'fusion-plugin-http-handler';`
        );
        addStatementAfter(
          path,
          `import BedrockCompatPlugin, {InitializeServerToken, BedrockCompatToken} from '@uber/fusion-plugin-bedrock-compat';`
        );
      }
    },
  };

  return {
    name: 'compat-plugin-http-handler',
    visitor: composeVisitors(errorHandlerVisitor, importVisitor),
  };
};
