/* @flow */

import {Stepper, step, type Step} from '@dubstep/core';
import {bumpDeps} from '../utils/bump-deps.js';
import {migrateCsrfProtectionToV2} from '../codemods/fusion-plugin-csrf-protection/enhancer.js';
import {installIntrospect} from '../codemods/fusion-plugin-introspect/installation.js';
import {replacePackage} from '../codemods/replace-package/codemod-replace-package.js';
import {addPackage} from '../codemods/add-package/codemod-add-package.js';
import {removePackage} from '../codemods/remove-package/codemod-remove-package.js';
import {addCreateTokenGenerics} from '../codemods/flow/create-token-generics.js';
import {addCreatePluginGenerics} from '../codemods/flow/create-plugin-generics.js';
import {codemodFusionPluginFontLoaderReact} from '../codemods/fusion-plugin-font-loader-react/codemod-fusion-plugin-font-loader-react';
import {fixMeTchannelMock} from '../codemods/flow/fixme-tchannel-mock.js';
import {format} from '../utils/format.js';
import type {UpgradeStrategy} from '../types.js';
import {codemodFusionApollo} from '../codemods/fusion-plugin-apollo/codemod-fusion-apollo';
import {codemodTypedRPCCLI} from '../codemods/typed-rpc-cli/codemod-typed-rpc-cli';

export type UpgradeOptions = {
  dir: string,
  match: string,
  codemod: boolean,
  force: boolean,
  strategy: UpgradeStrategy,
};

export const upgrade = async ({
  dir,
  match,
  codemod,
  force,
  strategy,
}: UpgradeOptions) => {
  const steps: Array<Step> = [];
  if (codemod) {
    // web app specific steps
    steps.push(
      step('migrate fusion-apollo', async () => {
        await codemodFusionApollo({dir, strategy});
      }),
      step('migrate typed-rpc-cli', async () => {
        await codemodTypedRPCCLI({dir, strategy});
      }),
      step('migrate fusion-plugin-csrf-protection', async () => {
        await migrateCsrfProtectionToV2({dir, strategy});
      }),
      step('install fusion-introspect', async () => {
        await installIntrospect({dir, strategy});
      }),
      step('remove fusion-react-async', async () => {
        await replacePackage({
          target: 'fusion-react-async',
          replacement: 'fusion-react',
          dir,
          strategy,
        });
      }),
      step('add eslint-plugin-react-hooks', async () => {
        await addPackage({
          name: 'eslint-plugin-react-hooks',
          dev: true,
          dir,
          strategy,
        });
      }),
      step('remove enzyme-context-patch', async () => {
        await removePackage({name: 'enzyme-context-patch', dir});
      }),
      step('add eslint-plugin-jest', async () => {
        await addPackage({
          name: 'eslint-plugin-jest',
          dir,
          strategy,
          dev: true,
        });
      }),
      step('use fusion-plugin-universal-events-react', async () => {
        await replacePackage({
          target: 'fusion-plugin-universal-events',
          replacement: 'fusion-plugin-universal-events-react',
          dir,
          strategy,
        });
      }),
      step('use fusion-plugin-m3-react', async () => {
        await replacePackage({
          target: '@uber/fusion-plugin-m3',
          replacement: '@uber/fusion-plugin-m3-react',
          dir,
          strategy,
        });
      }),
      step('use fusion-plugin-i18n-react', async () => {
        await replacePackage({
          target: 'fusion-plugin-i18n',
          replacement: 'fusion-plugin-i18n-react',
          dir,
          strategy,
        });
      }),
      step('use fusion-plugin-logtron-react', async () => {
        await replacePackage({
          target: '@uber/fusion-plugin-logtron',
          replacement: '@uber/fusion-plugin-logtron-react',
          dir,
          strategy,
        });
      }),
      step('ensure styletron-react peer dep', async () => {
        await addPackage({name: 'styletron-react', dir, strategy});
      }),
      step('add explicit flow generics for fusion', async () => {
        await addCreateTokenGenerics({dir});
        await addCreatePluginGenerics({dir});
      }),
      step('stop tchannel mock flow error', async () => {
        await fixMeTchannelMock({dir});
      }),
      step('register FontLoaderReactToken with FontLoader plugin', async () => {
        await codemodFusionPluginFontLoaderReact({dir});
      }),
      step('format', async () => {
        await format(dir);
      }),
      step('Remind about new deps', async () => {
        // eslint-disable-next-line no-console
        console.log('Codemods completed. Run `yarn install`');
      })
    );
  }
  steps.push(
    // generic steps
    step('upgrade', async () => await bumpDeps({dir, match, force, strategy}))
  );
  const stepper = new Stepper(steps);
  await stepper.run();
};
