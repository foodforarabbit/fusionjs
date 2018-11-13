import {exec} from '@dubstep/core';

export const format = async (dir: string) => {
  return exec(`npx eslint . --fix`, {
    cwd: dir,
  });
};
