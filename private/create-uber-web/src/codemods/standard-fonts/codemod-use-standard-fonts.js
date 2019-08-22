// @flow
import {addPackage} from '../add-package/codemod-add-package.js';
import {addPackageScript} from '../add-package-script/codemod-add-package-script.js';

type options = {
  dir: string,
};

export const codemodUseStandardFontLibrary = async ({dir}: options) => {
  await addPackage({
    name: '@uber/standard-fonts',
    dir,
    strategy: 'latest',
    dev: true,
  });

  await addPackageScript({
    name: 'get-uber-fonts',
    dir,
    script: 'copy-fonts src/config/fonts.js src/static/fonts',
  });
};
