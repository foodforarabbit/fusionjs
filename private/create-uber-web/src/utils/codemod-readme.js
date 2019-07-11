/* @flow */

import {replaceNunjucksFile} from './replace-nunjucks-file.js';
import {getUserName} from './get-user-name.js';
import {getUserEmail} from './get-user-email.js';

export const codemodReadme = async ({
  path,
  name,
  description,
  team,
}: {
  path: string,
  name: string,
  description: string,
  team: string,
}) => {
  await replaceNunjucksFile(path, {
    project: name,
    description,
    team,
    name: await getUserName(),
    email: await getUserEmail(),
  });
};
