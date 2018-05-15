const {matchStatement} = require('../../utils');

module.exports = () => ({
  name: 'remove-magellan-reducer',
  visitor: {
    ImportDeclaration(path) {
      if (
        matchStatement(
          path,
          `import {magellanReducer} from '@uber/internal-tool-layout'`,
          {shallow: true}
        )
      ) {
        const refPaths = path.scope.bindings.magellanReducer.referencePaths;
        refPaths.forEach(ref => ref.parentPath.remove());
        path.remove();
      }
    },
  },
});
