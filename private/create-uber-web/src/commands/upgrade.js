/* @flow */

import {Stepper, step, exec} from '@dubstep/core';
import {bumpDeps} from '../utils/bump-deps.js';

export type UpgradeOptions = {dir: string, match: string, force: boolean};

export const upgrade = async ({dir, match, force}: UpgradeOptions) => {
  const stepper = new Stepper([
    step('upgrade', async () => await bumpDeps(dir, match, force)),
  ]);
  await stepper.run();
};
