import {types as t} from '@babel/core';
import {
  withJsFiles,
  step,
  exec,
  parseJs,
  replaceJs,
  removeJsImports,
  ensureJsImports,
  visitJsImport,
  readFile,
} from '@dubstep/core';
export default step(
  'fusion-plugin-csrf-protection-enhancer-codemod',
  async () => {
    const pkg = JSON.parse(await readFile('package.json'));
    if (!pkg.dependencies['fusion-plugin-csrf-protection-react']) {
      return;
    }
    await withJsFiles('.', /^\.\/src\/main.js$/, p => true);
    await exec(
      `yarn remove fusion-plugin-csrf-protection-react && yarn add fusion-plugin-csrf-protection@latest fusion-react@latest`,
    );
    await withJsFiles('.', /^\.\/src\/(.*?).js$/, path => {
      let shouldUpdate = false;
      visitJsImport(
        path,
        `import {withFetch} from 'fusion-plugin-csrf-protection-react'`,
        (importPath, refs) => {
          shouldUpdate = true;
          refs.forEach(ref => {
            if (ref.parentPath.type !== 'CallExpression') {
              console.log(
                `WARNING: Unsure how to migrate withFetch with parent path: ${
                  ref.parentPath.type
                }`,
              );
              return;
            }
            ref.replaceWith(
              parseJs(`withServices({fetch: FetchToken});`).node.body[0],
            );
          });
          ensureJsImports(path, `import {withServices} from 'fusion-react';`);
          ensureJsImports(path, `import {FetchToken} from 'fusion-tokens';`);
          importPath.remove();
        },
      );
      visitJsImport(
        path,
        `import CsrfProtection from 'fusion-plugin-csrf-protection-react'`,
        (path, refs) => {
          shouldUpdate = true;
          const defaultSpecifier = path.node.specifiers.find(
            spec => spec.type === 'ImportDefaultSpecifier',
          );
          refs.forEach(r => {
            r.parentPath.insertAfter(
              parseJs(`app.register(FetchToken, unfetch);`).node,
            );
            r.parentPath.insertAfter(
              parseJs(
                `app.enhance(FetchToken, ${defaultSpecifier.local.name});`,
              ).node,
            );
            r.parentPath.remove();
          });
        },
      );
      removeJsImports(
        path,
        `import {
        FetchForCsrfToken,
        CsrfExpireToken
      } from 'fusion-plugin-csrf-protection-react'`,
      );
      visitJsImport(
        path,
        `import {CsrfIgnoreRoutesToken} from 'fusion-plugin-csrf-protection-react'`,
        ipath => {
          shouldUpdate = true;
          ipath.node.source = t.stringLiteral('fusion-plugin-csrf-protection');
        },
      );
      visitJsImport(
        path,
        `import CsrfProtectionPlugin from 'fusion-plugin-csrf-protection-react'`,
        ipath => {
          shouldUpdate = true;
          ipath.node.source = t.stringLiteral('fusion-plugin-csrf-protection');
        },
      );
      return shouldUpdate;
    });
  },
);
