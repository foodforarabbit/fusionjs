const getConfigDeclaration = require('../../utils/get-config-declaration.js');

// NOTE: This codemod needs to be run on a specific file: src/config/atreyu.js
module.exports = ({keyPath, config}) => (/*babel*/) => {
  return {
    name: `update ${keyPath} config`,
    visitor: {
      ExportDeclaration(path) {
        const configDeclaration = getConfigDeclaration(config, keyPath);
        path.node.declaration = configDeclaration;
      },
    },
  };
};
