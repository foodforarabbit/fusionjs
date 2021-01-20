// @flow
import {exec} from './exec';

export const install = async (dir: string) => {
  return exec(
    `yarn install --ignore-engines --ignore-scripts`,
    'Updating lockfile',
    {
      cwd: dir,
    }
  );
};

export const test = async (dir: string) => {
  return exec(`npm test`, 'Running tests', {cwd: dir});
};
