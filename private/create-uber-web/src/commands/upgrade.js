/* @flow */

import {Stepper, step} from '@dubstep/core';
import {bumpDeps} from '../utils/bump-deps.js';
import {migrateCsrfProtectionToV2} from '../codemods/fusion-plugin-csrf-protection/enhancer.js';
import {installIntrospect} from '../codemods/fusion-plugin-introspect/installation.js';
import {replacePackage} from '../codemods/replace-package/codemod-replace-package.js';
import {addPackage} from '../codemods/add-package/codemod-add-package.js';
import {removePackage} from '../codemods/remove-package/codemod-remove-package.js';
import {addCreateTokenGenerics} from '../codemods/flow/create-token-generics.js';
import {addCreatePluginGenerics} from '../codemods/flow/create-plugin-generics.js';
import {fixMeTchannelMock} from '../codemods/flow/fixme-tchannel-mock.js';
import {format} from '../utils/format.js';

export type UpgradeOptions = {
  dir: string,
  match: string,
  codemod: boolean,
  force: boolean,
  edge: boolean,
};

export const upgrade = async ({
  dir,
  match,
  codemod,
  force,
  edge,
}: UpgradeOptions) => {
  const steps = [
    // generic steps
    step('upgrade', async () => await bumpDeps({dir, match, force, edge})),
  ];
  if (codemod) {
    // web app specific steps
    steps.push(
      step('migrate fusion-plugin-csrf-protection', async () => {
        await migrateCsrfProtectionToV2({dir, edge});
      }),
      step('install fusion-introspect', async () => {
        await installIntrospect({dir, edge});
      }),
      step('remove fusion-react-async', async () => {
        await replacePackage({
          target: 'fusion-react-async',
          replacement: 'fusion-react',
          dir,
          edge,
        });
      }),
      step('remove enzyme-context-patch', async () => {
        await removePackage({name: 'enzyme-context-patch', dir});
      }),
      step('add eslint-plugin-jest', async () => {
        await addPackage({name: 'eslint-plugin-jest', dir, edge});
      }),
      step('use fusion-plugin-universal-events-react', async () => {
        await replacePackage({
          target: 'fusion-plugin-universal-events',
          replacement: 'fusion-plugin-universal-events-react',
          dir,
          edge,
        });
      }),
      step('use fusion-plugin-m3-react', async () => {
        await replacePackage({
          target: '@uber/fusion-plugin-m3',
          replacement: '@uber/fusion-plugin-m3-react',
          dir,
          edge,
        });
      }),
      step('use fusion-plugin-i18n-react', async () => {
        await replacePackage({
          target: 'fusion-plugin-i18n',
          replacement: 'fusion-plugin-i18n-react',
          dir,
          edge,
        });
      }),
      step('use fusion-plugin-logtron-react', async () => {
        await replacePackage({
          target: '@uber/fusion-plugin-logtron',
          replacement: '@uber/fusion-plugin-logtron-react',
          dir,
          edge,
        });
      }),
      step('ensure styletron-react peer dep', async () => {
        await addPackage({name: 'styletron-react', dir, edge: false});
      }),
      step('add explicit flow generics for fusion', async () => {
        await addCreateTokenGenerics({dir});
        await addCreatePluginGenerics({dir});
      }),
      step('stop tchannel mock flow error', async () => {
        await fixMeTchannelMock({dir});
      }),
      step('format', async () => {
        await format(dir);
      }),
      step('Remind about new deps', () => {
        // eslint-disable-next-line no-console
        console.log('Codemods completed. Run `yarn install`');
      })
    );
  }
  const stepper = new Stepper(steps);
  await stepper.run();
};
