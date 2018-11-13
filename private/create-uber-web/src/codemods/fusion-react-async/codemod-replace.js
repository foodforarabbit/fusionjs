import {types as t} from '@babel/core';
import {withJsFiles, step, visitJsImport, readFile, exec} from '@dubstep/core';
import fse from 'fs-extra';
export default step(
  'fusion-react-async-codemod-replace',

  async () => {
    const pkg = JSON.parse(await readFile('package.json'));
    if (!pkg.dependencies['fusion-react-async']) {
      return;
    }
    await exec(`yarn remove fusion-react-async`);

    await withJsFiles('.', /^\.\/src\/(.*?).js$/, path => {
      let shouldUpdate = false;
      function replaceImport(importPath) {
        shouldUpdate = true;
        importPath.node.source = t.stringLiteral('fusion-react');
      }
      const names = [
        'dispatched',
        'prepare',
        'prepared',
        'split',
        'exclude',
        'middleware',
      ];
      names.forEach(name => {
        visitJsImport(
          path,
          `import {${name}} from 'fusion-react-async'`,
          replaceImport,
        );
      });
      return shouldUpdate;
    });
  },
);
