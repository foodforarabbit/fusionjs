/* @flow */

import {replaceNunjucksFile} from './replace-nunjucks-file.js';

export const codemodSentry = async ({name}: {name: string}) => {
  await replaceNunjucksFile(`${name}/src/config/sentry.js`, {
    name,
  });
};
