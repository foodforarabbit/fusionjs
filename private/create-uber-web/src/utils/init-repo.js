/* @flow */
import {exec} from '@dubstep/core';

export const initRepo = async (root: string, name: string, team: string) => {
  const cwd = `${root}/${name}`;
  await exec(`git init`, {cwd});
  await exec(
    `git remote add origin gitolite@code.uber.internal:${team}/${name}`,
    {cwd}
  );
  await exec(`git add .`, {cwd});
  await exec(`git commit -m 'initial commit'`, {cwd});
};
