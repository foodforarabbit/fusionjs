/* @flow */

import {Stepper, step, type Step} from '@dubstep/core';
import {
  styledV7TypeArguments,
  styledV8ToThemedStyled,
} from '@uber-web-ui/baseui-codemods';
import {readJson} from 'fs-extra';
import {bumpDeps} from '../utils/bump-deps.js';
import {installFlowLibdefs} from '../utils/install-flow-libdefs.js';
import {checkMajorVersion} from '../utils/check-major-version.js';
import {migrateCsrfProtectionToV2} from '../codemods/fusion-plugin-csrf-protection/enhancer.js';
import {replacePackage} from '../codemods/replace-package/codemod-replace-package.js';
import {replacePackageImports} from '../codemods/replace-package-imports/codemod-replace-package-imports.js';
import {addPackage} from '../codemods/add-package/codemod-add-package.js';
import {removePackage} from '../codemods/remove-package/codemod-remove-package.js';
import {addCreateTokenGenerics} from '../codemods/flow/create-token-generics.js';
import {addCreatePluginGenerics} from '../codemods/flow/create-plugin-generics.js';
import {codemodFusionPluginFontLoaderReact} from '../codemods/fusion-plugin-font-loader-react/codemod-fusion-plugin-font-loader-react';
import {codemodUseStandardFontLibrary} from '../codemods/standard-fonts/codemod-use-standard-fonts';
import {fixMeTchannelMock} from '../codemods/flow/fixme-tchannel-mock.js';
import {format} from '../utils/format.js';
import type {UpgradeStrategy} from '../types.js';
import {codemodApolloHooks} from '../codemods/react-apollo-hooks/codemod-apollo-hooks';
import {codemodFusionApollo} from '../codemods/fusion-plugin-apollo/codemod-fusion-apollo';
import {codemodTypedRPCCLI} from '../codemods/typed-rpc-cli/codemod-typed-rpc-cli';
import {migrateGraphQLMetrics} from '../codemods/graphql-metrics/codemod';
import {addESLintPluginGraphQL} from '../codemods/add-eslint-plugin-graphql/add-eslint-plugin-graphql';
import {addESLintPluginBaseui} from '../codemods/add-eslint-plugin-baseui/add-eslint-plugin-baseui';
import {codemodIntrospectionMatcher} from '../codemods/introspection-matcher/codemod-introspection-matcher';
import {moveTypedRPCCLI} from '../codemods/move-typed-rpc-cli/move-typed-rpc-cli';
import {installFeatureToggles} from '../codemods/fusion-plugin-feature-toggles/installation';
import {
  ensureMinimalFlowConfigVersion,
  removeFlowConfigLines,
} from '../codemods/flowconfig/codemod-flowconfig';
import {updateSchemaPath} from '../codemods/update-schema-path/update-schema-path';
import {inlineReactHocs} from '../codemods/inline-react-hocs/codemod-inline-react-hocs.js';
import {codemodFusionPluginLogtron} from '../codemods/fusion-plugin-logtron/codemod-fusion-plugin-logtron';

export type UpgradeOptions = {
  dir: string,
  match: string,
  codemod: boolean,
  force: boolean,
  strategy: UpgradeStrategy,
  stepMatch?: string,
};

export const upgrade = async ({
  dir,
  match,
  codemod,
  force,
  strategy,
  stepMatch = '.*',
}: UpgradeOptions) => {
  // Check node version to ensure it's the latest supported version
  const websitePkg = await readJson(`${dir}/package.json`).catch(() => ({}));
  const engines = websitePkg.engines;
  if (!engines || !engines.node) {
    // eslint-disable-next-line no-console
    console.log(
      'Missing engines.node in your package.json. For more details see https://eng.uberinternal.com/docs/web/docs/references/environment-setup/#app-specific-environment.'
    );
    return;
  }
  const supportedVersion = '10.0.0'; // minimum node major version
  // Allow as long as the defined version is GTE than the supported major version
  if (!checkMajorVersion(engines.node, supportedVersion)) {
    // eslint-disable-next-line no-console
    console.log(
      `Your service's node version is unsupported. The current supported version is ${supportedVersion}. To upgrade:\n\n`,
      `1. Update the engines.node field to ${supportedVersion} in package.json.\n`,
      `2. Switch your current environment to ${supportedVersion}: "nvm install ${supportedVersion}" and "nvm use ${supportedVersion}".\n`,
      `3. Re-install @uber/create-uber-web if it does not exist in your new environment: "yarn global add @uber/create-uber-web".\n`,
      `4. Re-run "uber-web upgrade".`
    );
    return;
  }

  const steps: Array<Step> = [];
  if (codemod) {
    // web app specific steps
    steps.push(
      step('update .graphqlconfig', async () => {
        await updateSchemaPath({dir});
      }),
      step('migrate fusion-apollo', async () => {
        await codemodFusionApollo({dir, strategy});
      }),
      step('migrate @uber/fusion-plugin-graphql-metrics', async () => {
        await migrateGraphQLMetrics({dir, strategy});
      }),
      step('migrate typed-rpc-cli', async () => {
        await codemodTypedRPCCLI({dir, strategy});
      }),
      step('migrate fusion-plugin-csrf-protection', async () => {
        await migrateCsrfProtectionToV2({dir, strategy});
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
      step('add @uber/fusion-plugin-marketing package', async () => {
        await addPackage({
          name: '@uber/fusion-plugin-marketing',
          dir,
          strategy,
        });
      }),
      step('add @uber/fusion-plugin-feature-toggles', async () => {
        await installFeatureToggles({dir, strategy});
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
      step('create local React HOCs', async () => {
        await inlineReactHocs({dir, strategy});
      }),
      step('replace deprecated package imports', async () => {
        await replacePackageImports({
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
      step('apollo react hooks', async () => {
        await codemodApolloHooks({dir, strategy});
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
      step('use standard-fonts library', async () => {
        await codemodUseStandardFontLibrary({dir});
      }),
      step('apply type agruments to baseui styled function', async () => {
        await styledV7TypeArguments({dir});
      }),
      step('shift baseui themed styled to createThemedStyled', async () => {
        await styledV8ToThemedStyled({dir});
      }),
      step('introspection matcher', async () => {
        await codemodIntrospectionMatcher({dir, strategy});
      }),
      step('ensure minimal flow version', async () => {
        await ensureMinimalFlowConfigVersion({dir, version: '0.109.0'});
      }),
      step('un-include fusion-packaged libdefs', async () => {
        await removeFlowConfigLines({
          dir,
          section: 'libs',
          pattern: /node_modules\/fusion-(core|plugin-react-redux|plugin-rpc-redux-react|plugin-redux-action-emitter-enhancer)/,
        });
      }),
      step('format', async () => {
        await format(dir);
      }),
      step('Add eslint-plugin-graphql', async () => {
        await addESLintPluginGraphQL({dir, strategy});
      }),
      step('Add eslint-plugin-baseui', async () => {
        await addESLintPluginBaseui({dir});
      }),
      step('moveTypedRPCCLI', async () => {
        await moveTypedRPCCLI({dir, strategy});
      }),
      step('logtron codemod', async () => {
        await codemodFusionPluginLogtron({dir, strategy});
      }),
      step('Remind about new deps', async () => {
        // eslint-disable-next-line no-console
        console.log('Codemods completed. Run `yarn install`');
      })
    );
  }
  steps.push(
    // generic steps
    step('upgrade', async () => await bumpDeps({dir, match, force, strategy})),
    step(
      'install official libdefs',
      async () =>
        await installFlowLibdefs({
          dir,
          packages: [
            'locale@0.1.0',
            'redux', // use local version
            'redux-reactors@1.0.3',
          ],
        })
    )
  );
  const stepper = new Stepper(steps.filter(s => s.name.match(stepMatch)));
  await stepper.run();
};
