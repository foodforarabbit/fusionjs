/* @flow */

import {Stepper, step} from '@dubstep/core';
import {bumpDeps} from '../utils/bump-deps.js';
import codemods from '../codemods/index.js';
import {format} from '../utils/format.js';

export type UpgradeOptions = {dir: string, match: string, force: boolean};

export const upgrade = async ({dir, match, force}: UpgradeOptions) => {
  const stepper = new Stepper([
    ...codemods,
    step('upgrade', async () => await bumpDeps(dir, match, force)),
    step('format', async () => await format(dir)),
  ]);
  await stepper.run();
};
