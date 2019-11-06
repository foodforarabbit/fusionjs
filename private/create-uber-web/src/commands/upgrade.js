/* @flow */

import {Stepper, step, type Step} from '@dubstep/core';
import {
  styledV7TypeArguments,
  styledV8ToThemedStyled,
} from '@uber-web-ui/baseui-codemods';
import {bumpDeps} from '../utils/bump-deps.js';
import {installFlowLibdefs} from '../utils/install-flow-libdefs.js';
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
import {codemodIntrospectionMatcher} from '../codemods/introspection-matcher/codemod-introspection-matcher';
import {moveTypedRPCCLI} from '../codemods/move-typed-rpc-cli/move-typed-rpc-cli';
import {
  ensureMinimalFlowConfigVersion,
  removeFlowConfigLines,
} from '../codemods/flowconfig/codemod-flowconfig';
import {updateSchemaPath} from '../codemods/update-schema-path/update-schema-path';

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
      step('use fusion-plugin-universal-events', async () => {
        await replacePackageImports({
          target: 'fusion-plugin-universal-events-react',
          replacement: 'fusion-plugin-universal-events',
          imports: ['default', 'UniversalEventsToken'],
          typeImports: ['UniversalEventsDepsType', 'UniversalEventsType'],
          dir,
          strategy,
        });
      }),
      step('use fusion-plugin-m3', async () => {
        await replacePackageImports({
          target: '@uber/fusion-plugin-m3-react',
          replacement: '@uber/fusion-plugin-m3',
          imports: [
            'default',
            'M3Token',
            'M3ClientToken',
            'CommonTagsToken',
            'mock',
          ],
          typeImports: ['M3Type', 'M3TagsType', 'M3DepsType'],
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
      step('use fusion-plugin-logtron', async () => {
        await replacePackageImports({
          target: '@uber/fusion-plugin-logtron-react',
          replacement: '@uber/fusion-plugin-logtron',
          imports: [
            'default',
            'LogtronBackendsToken',
            'LogtronTeamToken',
            'LogtronTransformsToken',
          ],
          dir,
          strategy,
        });
      }),
      step('use fusion-plugin-google-analytics', async () => {
        await replacePackageImports({
          target: '@uber/fusion-plugin-google-analytics-react',
          replacement: '@uber/fusion-plugin-google-analytics',
          imports: [
            'default',
            'GoogleAnalyticsToken',
            'GoogleAnalyticsConfigToken',
          ],
          dir,
          strategy,
        });
      }),
      step('use fusion-plugin-tealium', async () => {
        await replacePackageImports({
          target: '@uber/fusion-plugin-tealium-react',
          replacement: '@uber/fusion-plugin-tealium',
          imports: ['default', 'TealiumToken', 'TealiumConfigToken'],
          dir,
          strategy,
        });
      }),
      step('use fusion-plugin-rpc and fusion-rpc-redux', async () => {
        await replacePackageImports({
          target: 'fusion-plugin-rpc-redux-react',
          replacement: 'fusion-plugin-rpc',
          imports: [
            'default',
            'mock',
            'BodyParserOptionsToken',
            'ResponseError',
            'RPCToken',
            'RPCHandlersToken',
          ],
          dir,
          strategy,
        });
        await replacePackageImports({
          target: 'fusion-plugin-rpc-redux-react',
          replacement: 'fusion-rpc-redux',
          imports: ['createRPCReducer'],
          typeImports: ['ActionType'],
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
        await ensureMinimalFlowConfigVersion({dir, version: '0.102.0'});
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
      step('moveTypedRPCCLI', async () => {
        await moveTypedRPCCLI({dir, strategy});
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
            'koa@2.7.0',
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
