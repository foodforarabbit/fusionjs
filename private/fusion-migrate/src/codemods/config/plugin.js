const loadConfig = require('../../utils/load-config.js');
const getConfigDeclaration = require('../../utils/get-config-declaration.js');

// NOTE: This codemod needs to be run on a specific file: src/config/atreyu.js
module.exports = ({dir, keyPath}) => (/*babel*/) => {
  return {
    name: `update ${keyPath} config`,
    visitor: {
      ExportDeclaration(path) {
        const config = loadConfig(dir);
        const configDeclaration = getConfigDeclaration(config, keyPath);
        path.node.declaration = configDeclaration;
      },
    },
  };
};
