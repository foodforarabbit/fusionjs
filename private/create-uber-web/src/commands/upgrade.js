/* @flow */

import {Stepper, step, exec} from '@dubstep/core';
import {bumpDeps} from '../utils/bump-deps.js';
import codemods from '../codemods/index';

export type UpgradeOptions = {dir: string, match: string, force: boolean};

export const upgrade = async ({dir, match, force}: UpgradeOptions) => {
  const stepper = new Stepper([
    ...codemods,
    step('upgrade', async () => await bumpDeps(dir, match, force)),
  ]);
  await stepper.run();
};
