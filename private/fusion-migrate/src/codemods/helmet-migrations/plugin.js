const fs = require('fs');
const {matchStatement, replaceStatement} = require('../../utils');
const ensureImportDeclaration = require('../../utils/ensure-import-declaration.js');

const before = fs.readFileSync(__dirname + '/snippets/root/before.js', 'utf-8');
const after = fs.readFileSync(__dirname + '/snippets/root/after.js', 'utf-8');

module.exports = () => ({
  name: 'helmet-migrations',
  visitor: {
    Program(path) {
      ensureImportDeclaration(
        path.node.body,
        `import {assetUrl} from 'fusion-core'`
      );

      ensureImportDeclaration(
        path.node.body,
        `import {Helmet} from 'fusion-plugin-react-helmet-async'`
      );
    },
    ExportNamedDeclaration(path) {
      if (matchStatement(path, before, {shallow: true})) {
        replaceStatement(path, after);
      }
    },
  },
});
