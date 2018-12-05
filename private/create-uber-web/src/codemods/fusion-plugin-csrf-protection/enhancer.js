// @flow
import {types as t} from '@babel/core';
import {
  step,
  parseJs,
  removeJsImports,
  ensureJsImports,
  visitJsImport,
  readFile,
  writeFile,
} from '@dubstep/core';
import log from '../../utils/log';
import {withJsFiles} from '../../utils/with-js-files';
import {getLatestVersion} from '../../utils/get-latest-version';

export default step(
  'fusion-plugin-csrf-protection-enhancer-codemod',
  async () => {
    const pkg = JSON.parse(await readFile('package.json'));
    if (!pkg.dependencies['fusion-plugin-csrf-protection-react']) {
      return;
    }
    log.title('Csrf Protection Codemod');
    delete pkg.dependencies['fusion-plugin-csrf-protection-react'];
    pkg.dependencies['fusion-plugin-csrf-protection'] = await getLatestVersion(
      'fusion-plugin-csrf-protection'
    );
    pkg.dependencies['fusion-react'] = await getLatestVersion('fusion-react');
    writeFile('package.json', JSON.stringify(pkg, null, 2));
    await withJsFiles(path => {
      let shouldUpdate = false;
      visitJsImport(
        path,
        `import {withFetch} from 'fusion-plugin-csrf-protection-react'`,
        (importPath, refs) => {
          shouldUpdate = true;
          refs.forEach(ref => {
            if (ref.parentPath.type !== 'CallExpression') {
              // eslint-disable-next-line no-console
              console.log(
                `WARNING: Unsure how to migrate withFetch with parent path: ${
                  ref.parentPath.type
                }`
              );
              return;
            }
            ref.replaceWith(
              parseJs(`withServices({fetch: FetchToken});`).node.body[0]
            );
          });
          ensureJsImports(path, `import {withServices} from 'fusion-react';\n`);
          ensureJsImports(path, `import {FetchToken} from 'fusion-tokens';\n`);
          importPath.remove();
        }
      );
      visitJsImport(
        path,
        `import CsrfProtection from 'fusion-plugin-csrf-protection-react'`,
        (path, refs) => {
          shouldUpdate = true;
          const defaultSpecifier = path.node.specifiers.find(
            spec => spec.type === 'ImportDefaultSpecifier'
          );
          refs.forEach(r => {
            r.parentPath.insertAfter(
              parseJs(`app.register(FetchToken, unfetch);\n`).node.body[0]
            );
            r.parentPath.insertAfter(
              parseJs(
                `app.enhance(FetchToken, ${defaultSpecifier.local.name});\n`
              ).node.body[0]
            );
            r.parentPath.remove();
          });
        }
      );
      removeJsImports(
        path,
        `import {
        FetchForCsrfToken,
        CsrfExpireToken
      } from 'fusion-plugin-csrf-protection-react'`
      );
      visitJsImport(
        path,
        `import {CsrfIgnoreRoutesToken} from 'fusion-plugin-csrf-protection-react'`,
        ipath => {
          shouldUpdate = true;
          ipath.node.source = t.stringLiteral('fusion-plugin-csrf-protection');
        }
      );
      visitJsImport(
        path,
        `import CsrfProtectionPlugin from 'fusion-plugin-csrf-protection-react'`,
        ipath => {
          shouldUpdate = true;
          ipath.node.source = t.stringLiteral('fusion-plugin-csrf-protection');
        }
      );
      return shouldUpdate;
    });
  }
);
