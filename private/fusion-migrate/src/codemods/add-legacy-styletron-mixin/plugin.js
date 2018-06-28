const {astOf} = require('../../utils');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const getProgram = require('../../utils/get-program.js');
const visitNewAppExpression = require('../../utils/visit-new-app-expression.js');

module.exports = babel => {
  const t = babel.types;
  const visitor = visitNewAppExpression(t, (t, state, refPath) => {
    refPath.parentPath.parentPath.parentPath.insertBefore(
      astOf(`const LegacyStyledApp = legacyStyling(App);`)
    );
    refPath.node.name = 'LegacyStyledApp';
    const program = getProgram(refPath);
    const body = program.node.body;
    ensureImportDeclaration(
      body,
      `import {legacyStyling} from '@uber/fusion-legacy-styling-compat-mixin'`
    );
  });
  return {
    name: 'add-legacy-styletron-mixin',
    visitor,
  };
};
