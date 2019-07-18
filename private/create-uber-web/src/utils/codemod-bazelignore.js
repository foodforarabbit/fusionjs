/* @flow */

import {readFile, writeFile} from '@dubstep/core';

export const codemodBazelIgnore = async ({
  root,
  name,
}: {
  root: string,
  name: string,
}) => {
  const bazelIgnore = await readFile(`${root}/.bazelignore`);
  const lines = bazelIgnore.split('\n');
  lines.push(`projects/${name}/node_modules`);
  await writeFile(
    `${root}/.bazelignore`,
    [...new Set(lines)].sort().join('\n')
  );
};
