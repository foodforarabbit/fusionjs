const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = babel => {
  const t = babel.types;
  const visitor = visitNamedModule({
    t,
    packageName: 'fusion-plugin-styletron-react',
    refsHandler: (t, state, refPaths, importPath) => {
      refPaths.forEach(p => {
        p.parentPath.remove();
      });
      importPath.remove();
    },
  });
  return {
    name: 'remove-styletron-react-plugin',
    visitor,
  };
};
