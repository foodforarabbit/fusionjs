module.exports = replaceImportDeclaration;

/*
  Before:
  import thing from 'originalPackage';

  After:
  import {thing} from 'finalPackage'
*/
function replaceImportDeclaration(t, originalPackage, finalPackage, name) {
  return {
    ImportDeclaration(path /*: Object */) {
      const sourceName = path.get('source').node.value;
      if (sourceName !== originalPackage) {
        return;
      }
      if (!name) {
        path.replaceWith(
          t.importDeclaration(
            [t.importDefaultSpecifier(path.get('specifiers')[0].node.local)],
            t.stringLiteral(finalPackage)
          )
        );
      } else {
        path.replaceWith(
          t.importDeclaration(
            [t.importSpecifier(t.identifier(name), t.identifier(name))],
            t.stringLiteral(finalPackage)
          )
        );
      }
    },
  };
}
