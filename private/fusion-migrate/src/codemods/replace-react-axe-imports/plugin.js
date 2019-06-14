const {astOf} = require('../../utils/index.js');

module.exports = () => {
  let reactAxeName = '';

  return {
    name: 'replace-react-axe-imports',
    visitor: {
      ImportDeclaration(path) {
        const sourceName = path.node.source.value;
        if (sourceName === 'react-axe') {
          const specifiers = path.get('specifiers');
          const reactAxeSpecifier = specifiers.find(
            specifier => specifier.type === 'ImportDefaultSpecifier'
          );
          reactAxeName = reactAxeSpecifier.node.local.name;
          path.remove();
        }
      },
      IfStatement(path) {
        const ifTest = path.get('test');
        if (ifTest.isIdentifier({name: '__DEV__'})) {
          const ifConsequent = path.get('consequent');
          let axeRequired = false;
          ifConsequent.traverse({
            CallExpression(path) {
              if (axeRequired) {
                return;
              }
              if (path.get('callee').isIdentifier({name: 'require'})) {
                if (path.get('arguments')[0].node.value === 'react-axe') {
                  axeRequired = true;
                }
              } else if (
                path.get('callee').isIdentifier({name: reactAxeName})
              ) {
                path
                  .getStatementParent()
                  .insertBefore(
                    astOf(`const ${reactAxeName} = require('react-axe');`)
                  );
              }
            },
          });
        }
      },
    },
  };
};
