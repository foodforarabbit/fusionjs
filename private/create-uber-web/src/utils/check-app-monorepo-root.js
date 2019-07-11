/* @flow */
import {existsSync} from 'fs';

export const checkAppMonorepoRoot = async (root: string) => {
  return existsSync(`${root}/manifest.json`) && existsSync(`${root}/WORKSPACE`);
};
