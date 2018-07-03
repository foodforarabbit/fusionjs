const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');
const getConfigDeclaration = require('../../utils/get-config-declaration.js');
const getProgram = require('../../utils/get-program.js');

// NOTE: This codemod needs to be run on a specific file: src/config/atreyu.js
module.exports = ({keyPath, config}) => (/*babel*/) => {
  return {
    name: `update ${keyPath} config`,
    visitor: {
      ExportDeclaration(path) {
        const program = getProgram(path);
        const body = program.node.body;
        ensureImportDeclaration(body, `import extend from 'just-extend'`);
        const configDeclaration = getConfigDeclaration(config, keyPath);
        path.node.declaration = configDeclaration;
      },
    },
  };
};
