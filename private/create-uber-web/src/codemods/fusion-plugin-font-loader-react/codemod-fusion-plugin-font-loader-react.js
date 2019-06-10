// @flow
import {withJsFile, replaceJs, ensureJsImports} from '@dubstep/core';

type options = {
  fileName: string,
};

export const codemodFusionPluginFontLoaderReact = async ({
  fileName,
}: options) => {
  await withJsFile(fileName, async program => {
    ensureJsImports(
      program,
      `import {FontLoaderReactToken} from 'fusion-plugin-font-loader-react'`
    );
    replaceJs(
      program,
      'app.register(FontLoaderPlugin);',
      'app.register(FontLoaderReactToken, FontLoaderPlugin);'
    );
  });
};
