const {matchStatement, addStatementAfter} = require('../../utils');

module.exports = () => {
  return {
    name: 'add-heatpipe-plugin',
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source;
        const defaultSpecifier = path.get('specifiers').find(specifier => {
          return specifier.type === 'ImportDefaultSpecifier';
        });
        const isAppImport =
          source.type === 'StringLiteral' &&
          source.value == 'fusion-react' &&
          defaultSpecifier;

        const importStatement = `import HeatpipePlugin, {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';`;
        const modded = path.parentPath.node.body.find(node => {
          return matchStatement({node}, importStatement, {shallow: true});
        });
        if (isAppImport && !modded) {
          addStatementAfter(
            path,
            `import HeatpipePlugin, {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';`
          );
          const localPath = defaultSpecifier.get('local');
          const localName = localPath.node.name;
          const refPaths = localPath.scope.bindings[localName].referencePaths;
          const newPath = refPaths.find(refPath => {
            return refPath.parent.type === 'NewExpression';
          });
          addStatementAfter(
            newPath.parentPath.parentPath.parentPath,
            `app.register(HeatpipeToken, HeatpipePlugin);`
          );
        }
      },
    },
  };
};
