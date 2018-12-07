const visitNamedModule = require('../../utils/visit-named-module.js');

module.exports = state => () => {
  return {
    name: 'match-routes',
    visitor: visitNamedModule({
      moduleName: 'Route',
      packageName: 'react-router',
      refsHandler: (t, s, refPaths, importPath) => {
        if (state.routesFile) {
          return;
        }
        const filename = s.file.opts.filename;
        if (
          refPaths.some(ref => ref.type === 'JSXIdentifier') &&
          !filename.includes('test')
        ) {
          state.routesFile = filename;
        }
      },
    }),
  };
};
