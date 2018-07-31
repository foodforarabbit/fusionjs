/* @flow */

import {exec} from '@dubstep/core';

export const checkYarnRegistry = async () => {
  const npmrc = await exec('cat ~/.npmrc').catch(() => 'unpm'); // file not found means it's running in CI
  if (!npmrc.match(/unpm/)) {
    throw new Error('~/.npmrc should point to internal registry');
  }
};
