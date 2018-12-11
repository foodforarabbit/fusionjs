/* @flow */

import {Stepper, step} from '@dubstep/core';
import {bumpDeps} from '../utils/bump-deps.js';
import {migrateCsrfProtectionToV2} from '../codemods/fusion-plugin-csrf-protection/enhancer.js';
import {replacePackage} from '../codemods/replace-package/codemod-replace-package.js';
import {addPackage} from '../codemods/add-package/codemod-add-package.js';
import {format} from '../utils/format.js';

export type UpgradeOptions = {
  dir: string,
  match: string,
  codemod: boolean,
  force: boolean,
};

export const upgrade = async ({dir, match, codemod, force}: UpgradeOptions) => {
  const steps = [
    // generic steps
    step('upgrade', async () => await bumpDeps(dir, match, force)),
  ];
  if (codemod) {
    // web app specific steps
    steps.push(
      step('migrate fusion-plugin-csrf-protection', async () => {
        await migrateCsrfProtectionToV2({dir});
      }),
      step('remove fusion-react-async', async () => {
        await replacePackage({
          target: 'fusion-react-async',
          replacement: 'fusion-react',
          dir,
        });
      }),
      step('use fusion-plugin-universal-events-react', async () => {
        await replacePackage({
          target: 'fusion-plugin-universal-events',
          replacement: 'fusion-plugin-universal-events-react',
          dir,
        });
      }),
      step('use fusion-plugin-m3-react', async () => {
        await replacePackage({
          target: '@uber/fusion-plugin-m3',
          replacement: '@uber/fusion-plugin-m3-react',
          dir,
        });
      }),
      step('use fusion-plugin-i18n-react', async () => {
        await replacePackage({
          target: 'fusion-plugin-i18n',
          replacement: 'fusion-plugin-i18n-react',
          dir,
        });
      }),
      step('use fusion-plugin-logtron-react', async () => {
        await replacePackage({
          target: '@uber/fusion-plugin-logtron',
          replacement: '@uber/fusion-plugin-logtron-react',
          dir,
        });
      }),
      step('ensure styletron-react peer dep', async () => {
        await addPackage({name: 'styletron-react', dir});
      }),
      step('format', async () => {
        await format(dir);
      })
    );
  }
  const stepper = new Stepper(steps);
  await stepper.run();
};
