const t = require('@babel/types');

module.exports = () => {
  return {
    name: 'replace-react-router-imports',
    visitor: {
      ImportDeclaration(path) {
        const sourceName = path.node.source.value;
        if (sourceName === 'react-router') {
          const specifiers = path.get('specifiers');
          const browserHistorySpecifier = specifiers.find(specifier => {
            return (
              specifier.type === 'ImportSpecifier' &&
              specifier.node.imported.name === 'browserHistory'
            );
          });
          const otherSpecifiers = specifiers
            .filter(s => s !== browserHistorySpecifier)
            .map(s => s.node);
          if (browserHistorySpecifier) {
            browserHistorySpecifier.node.imported.name = 'browserHistoryCompat';
            path.insertAfter(
              t.importDeclaration(
                [browserHistorySpecifier.node],
                t.stringLiteral('@uber/fusion-plugin-react-router-v3-compat')
              )
            );
          }
          if (otherSpecifiers.length) {
            path.insertAfter(
              t.importDeclaration(
                otherSpecifiers,
                t.stringLiteral('fusion-plugin-react-router')
              )
            );
          }
          path.remove();
        }
      },
    },
  };
};
