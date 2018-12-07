const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = () => {
  const namedModuleVisitor = visitNamedModule({
    moduleName: 'IndexRoute',
    packageName: 'react-router',
    refsHandler: (t, state, refPaths) => {
      refPaths.forEach(refPath => {
        const elementPath = refPath.parentPath.parentPath;
        elementPath.replaceWith(
          t.JSXElement(
            t.JSXOpeningElement(
              t.JSXIdentifier('Route'),
              [
                t.JSXAttribute(t.JSXIdentifier('path'), t.StringLiteral('/')),
                t.JSXAttribute(t.JSXIdentifier('exact')),
                ...elementPath.node.openingElement.attributes.filter(f => {
                  return f.name.name !== 'path' && f.name.name !== 'exact';
                }),
              ],
              true
            ),
            null,
            []
          )
        );
      });
    },
  });
  return {
    name: 'index-route',
    visitor: namedModuleVisitor,
  };
};
