const {
  addStatementAfter,
  addImportSpecifier,
  astOf,
} = require('../../utils/index.js');
const composeVisitors = require('../../utils/compose-visitors.js');
const visitNewAppExpression = require('../../utils/visit-new-app-expression.js');

module.exports = babel => {
  const t = babel.types;
  const appVisitor = visitNewAppExpression(t, (t, state, refPath) => {
    refPath.parentPath.parentPath.parentPath.parentPath.traverse({
      IfStatement(path) {
        if (path.node.test.name === '__NODE__') {
          path.node.consequent.body.push(
            astOf(`app.enhance(SSRDeciderToken, ProxySSRDecider);`)
          );
          path.node.consequent.body.push(
            astOf(`app.register(ProxyConfigToken, proxyConfig)`)
          );
        }
      },
    });
  });

  return {
    name: 'compat-plugin-proxies',
    visitor: composeVisitors(appVisitor, {
      ImportDeclaration(path) {
        const sourceName = path.node.source.value;
        if (sourceName === 'fusion-core') {
          addImportSpecifier(path, 'SSRDeciderToken');
          addStatementAfter(
            path,
            `import ProxyPlugin, {ProxyConfigToken,ProxySSRDecider} from '@uber/fusion-plugin-proxy-compat';`
          );
          addStatementAfter(
            path,
            `import proxyConfig from './config/proxies.js';`
          );
        }
      },
    }),
  };
};
