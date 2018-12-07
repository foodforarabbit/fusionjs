const {astOf} = require('../../utils');
const t = require('@babel/types');
const {withJsFiles, withJsFile, visitJsImport, step} = require('@dubstep/core');

module.exports = step('mod-urate', async () => {
  let hasUrate = false;
  let urateConfigPath = null;
  await withJsFiles('src/**/*.js', path => {
    visitJsImport(
      path,
      `import initUrateController from '@uber/urate-widget/server';`,
      (p, refPaths) => {
        p.remove();
        refPaths.forEach(ref => ref.parentPath.remove());
        hasUrate = true;
      }
    );
    visitJsImport(
      path,
      `import UrateWidget from '@uber/urate-widget';`,
      (p, refPaths) => {
        p.remove();
        refPaths.forEach(ref => {
          urateConfigPath = ref.parentPath.node.arguments[0];
          ref.parentPath.remove();
        });
        hasUrate = true;
      }
    );
  });
  if (!hasUrate) {
    return;
  }
  await withJsFile('src/main.js', path => {
    visitJsImport(
      path,
      `import CsrfProtectionPlugin from 'fusion-plugin-csrf-protection-react';`,
      (importPath, refPaths) => {
        importPath.insertAfter(
          astOf(
            `import UratePlugin, {UrateConfigToken, UrateToken} from '@uber/fusion-plugin-urate';`
          )
        );
        refPaths[0].parentPath.insertAfter(
          astOf(`app.register(UrateToken, UratePlugin);`)
        );
        refPaths[0].parentPath.insertAfter(
          t.callExpression(
            t.memberExpression(t.identifier('app'), t.identifier('register')),
            [t.identifier('UrateConfigToken'), urateConfigPath]
          )
        );
      }
    );
  });
});
