const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = () => {
  const visitor = visitNamedModule({
    packageName: '@uber/internal-tool-layout',
    refsHandler: (t, state, refPaths, path) => {
      refPaths.forEach(refPath => {
        const elementParent = refPath.parentPath.parentPath;
        elementParent.replaceWith(
          t.JSXElement(
            t.JSXOpeningElement(t.JSXIdentifier('div'), [], false),
            t.JSXClosingElement(t.JSXIdentifier('div')),
            elementParent.node.children
          )
        );
      });
      path.remove();
    },
  });
  return {
    name: 'remove-internal-tool-layout',
    visitor,
  };
};
