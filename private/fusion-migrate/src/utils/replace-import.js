const babylon = require('babylon');
const ensureImportDeclaration = require('./ensure-import-declaration');
const getProgram = require('./get-program');
const pathUtils = require('path');

module.exports = replaceImport;

/*
  @oldImport: string representing import to replace:
    `import a from a`
    `import {a} from a` etc
  @newImport: string representing import to replace with:
    `import c from c`
    `import {c} from c` etc
  @localSourcePath: optional, string. If import source is relative, path of referenced module
    'src/config/fonts'
    When using relative imports, source of @oldImport and @newImport can be blank. Util will look
    for all imports whose relative source resolves to @localSourcePath
*/
function replaceImport(oldImport, newImport, localSourcePath) {
  const oldImportAST = babylon.parse(oldImport, {sourceType: 'module'}).program
    .body[0];
  const newImportAST = babylon.parse(newImport, {sourceType: 'module'}).program
    .body[0];
  if (oldImportAST.specifiers.length !== 1) {
    throw new Error('original import must have exactly one specifier');
  }
  if (newImportAST.specifiers.length !== 1) {
    throw new Error('new import must have exactly one specifier');
  }
  const oldSource = oldImportAST.source.value;
  const oldSpecifier = oldImportAST.specifiers[0];
  const oldIdentifier = oldSpecifier.local.name;
  const newIdentifier = newImportAST.specifiers[0].local.name;

  return {
    ImportDeclaration(path /*: Object */, state) {
      const thisSource = path.node.source.value;
      const isRelativeSource = thisSource.startsWith('.');
      const thisDirName =
        state.file.opts.filename && pathUtils.dirname(state.file.opts.filename);
      const absoluteSource = isRelativeSource
        ? pathUtils.resolve(thisDirName, thisSource)
        : thisSource;
      const body = getProgram(path).node.body;
      let addNewImport = false;
      if (
        // If localSourcePath supplied, accept any source that resolves to localSourcePath
        localSourcePath
          ? absoluteSource !==
            pathUtils.join(state.file.opts.cwd, localSourcePath)
          : thisSource !== oldSource
      ) {
        return;
      }

      // remove or trim existing specifiers
      const specs = path.node.specifiers;
      const specifiersToKeep = specs.filter(spec => {
        if (oldSpecifier.type === 'ImportDefaultSpecifier') {
          return spec.type !== 'ImportDefaultSpecifier';
        } else if (
          spec.type === 'ImportSpecifier' &&
          spec.imported.name === oldSpecifier.imported.name
        ) {
          return false;
        }
        return true;
      });
      if (specifiersToKeep.length !== path.node.specifiers.length) {
        // add new import
        if (isRelativeSource) {
          newImport = newImport.replace(/(?:'|").*(?:'|")/, `'${thisSource}'`);
        }
        addNewImport = true;
      }
      // swap all usages
      path.scope.rename(oldIdentifier, newIdentifier);
      if (!specifiersToKeep.length) {
        path.remove();
      } else {
        path.node.specifiers = specifiersToKeep;
      }
      if (addNewImport) {
        ensureImportDeclaration(body, newImport);
      }
    },
  };
}
