/* eslint-env node */
const t = require('@babel/types');

module.exports = createNamedModuleVisitor;

/**
 * Visits all references to a given module from a given package
 */
function createNamedModuleVisitor({
  moduleName,
  packageName,
  visitDefault,
  refsHandler,
}) {
  const compareToModuleName = Array.isArray(moduleName)
    ? s => moduleName.includes(s)
    : s => s === moduleName;
  if (!moduleName) {
    visitDefault = true;
  }
  return {
    /**
     * Handle ES imports
     *
     * import {moduleName} from 'packageName';
     */
    ImportDeclaration(path /*: Object */, state /*: Object */) {
      if (path.removed) {
        return;
      }
      const sourceName = path.get('source').node.value;
      if (
        (Array.isArray(packageName) &&
          packageName.indexOf(sourceName) === -1) ||
        (typeof packageName === 'string' && sourceName !== packageName)
      ) {
        return;
      }
      state.importedPackageName = sourceName;
      path.get('specifiers').forEach(specifier => {
        const localPath = specifier.get('local');
        const localName = localPath.node.name;
        const binding = path.scope.bindings[localName];
        const refPaths = binding ? binding.referencePaths : [];
        if (t.isImportSpecifier(specifier) && moduleName) {
          // import {moduleName} from 'packageName';
          const specifierName = specifier.get('imported').node.name;
          if (compareToModuleName(specifierName)) {
            refsHandler(t, state, refPaths, path);
          }
        } else if (t.isImportNamespaceSpecifier(specifier)) {
          // import * as pkg from 'packageName';
          // TODO(#5): Handle this case, or issue a warning because this may not be 100% robust
        } else if (t.isImportDefaultSpecifier(specifier) && visitDefault) {
          refsHandler(t, state, refPaths, path);
        }
      });
    },
  };
}
