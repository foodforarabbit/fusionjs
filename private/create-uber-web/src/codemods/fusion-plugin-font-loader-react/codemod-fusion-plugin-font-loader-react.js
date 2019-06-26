// @flow
import {
  withJsFiles,
  visitJsImport,
  replaceJs,
  ensureJsImports,
} from '@dubstep/core';
import hasRegistrationUsage from '../utils/has-registration-usage.js';

type options = {
  dir: string,
};

export const codemodFusionPluginFontLoaderReact = async ({dir}: options) => {
  await withJsFiles(`${dir}/**/*.js`, async path => {
    visitJsImport(
      path,
      `import FontLoaderPlugin from 'fusion-plugin-font-loader-react'`,
      (importPath, refs) => {
        const specifier = importPath.node.specifiers.find(spec => {
          return spec.type === 'ImportDefaultSpecifier';
        });
        if (!specifier) {
          return;
        }
        const localName = specifier.local.name;
        if (hasRegistrationUsage(path, localName)) {
          ensureJsImports(
            path,
            `import {FontLoaderReactToken} from 'fusion-plugin-font-loader-react'`
          );
          replaceJs(
            path,
            `app.register(${localName});`,
            `app.register(FontLoaderReactToken, ${localName});`
          );
        }
      }
    );
  });
};
