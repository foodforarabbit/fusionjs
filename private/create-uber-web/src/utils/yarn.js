// @flow
import {exec} from '@dubstep/core';
export const install = async (dir: string) => {
  return exec(`yarn install --silent --ignore-engines --ignore-scripts`, {
    cwd: dir,
  });
};

export const test = async (dir: string) => {
  await install(dir);
  return exec(`yarn test`, {cwd: dir});
};
