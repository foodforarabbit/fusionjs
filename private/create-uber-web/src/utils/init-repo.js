/* @flow */
import {exec} from '@dubstep/core';

export const initRepo = async (name: string, team: string) => {
  await exec(`git init`, {cwd: name});
  await exec(
    `git remote add origin gitolite@code.uber.internal:${team}/${name}`,
    {cwd: name},
  );
  await exec(`git add .`, {cwd: name});
  await exec(`git commit -m 'initial commit'`, {cwd: name});
};
