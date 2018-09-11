/* @flow */

import {Stepper, step, exec} from '@dubstep/core';
import {bumpDeps} from '../utils/bump-deps.js';

export type UpgradeOptions = {dir: string, skipInstall: boolean};

export const upgrade = async ({dir, skipInstall}: UpgradeOptions) => {
  const stepper = new Stepper([
    step('upgrade', async () => await bumpDeps(dir)),
    step('regenerate lock file', async () => {
      if (!skipInstall)
        await exec(`yarn install --silent --ignore-engines --ignore-scripts`, {
          cwd: dir,
        });
    }),
  ]);
  await stepper.run();
};
