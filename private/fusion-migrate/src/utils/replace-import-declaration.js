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
      const spec = path.get('specifiers')[0];
      const sourceName = path.get('source').node.value;
      if (!spec) {
        return;
      }
      const local = spec.node.local;
      if (sourceName !== originalPackage) {
        return;
      }
      if (!name) {
        path.replaceWith(
          t.importDeclaration(
            [t.importDefaultSpecifier(local)],
            t.stringLiteral(finalPackage)
          )
        );
      } else {
        path.replaceWith(
          t.importDeclaration(
            [t.importSpecifier(local, t.identifier(name))],
            t.stringLiteral(finalPackage)
          )
        );
      }
    },
  };
}
