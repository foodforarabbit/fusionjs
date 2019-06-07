// @flow

import {
  withJsFile,
  ensureJsImports,
  insertJsBefore,
  writeFile,
} from '@dubstep/core';

import isFile from './utils/is-file.js';
import {addPackage} from '../add-package/codemod-add-package.js';
import type {UpgradeStrategy} from '../../types.js';

type InstallOptions = {
  dir: string,
  strategy: UpgradeStrategy,
};

export const installFeatureToggles = async ({
  dir,
  strategy,
}: InstallOptions): Promise<void> => {
  if (strategy === 'curated') strategy = 'latest';

  /* Run a few checks to ensure that we can install feature toggles.  At a
   * minimum, we expect the following prerequisites:
   *    - existence of src/main.js
   *    - 'return app.js' in default export of src/main.js
   */
  const mainFilePath = `${dir}/src/main.js`;
  if (!(await isFile(mainFilePath)) || !(await hasAppReturn(mainFilePath))) {
    throw new Error(
      'Unable to register Feature Toggles plugin.  Please manually install @uber/fusion-plugin-feature-toggles-react.'
    );
  }

  // Add @uber/fusion-plugin-feature-toggles-react package as a dependency
  await addPackage({
    name: '@uber/fusion-plugin-feature-toggles-react',
    dir,
    strategy,
  });

  /* Attempt to register the core plugin and configuration token */
  await withJsFile(mainFilePath, async program => {
    const pluginImport = `
      import FeatureTogglesPlugin, {
        FeatureTogglesTogglesConfigToken
      } from '@uber/fusion-plugin-feature-toggles-react';
    `;

    // Add FeatureTogglesPlugin and FeatureTogglesTogglesConfigToken imports
    const [
      // $FlowFixMe
      {default: plugin, FeatureTogglesTogglesConfigToken: configToken},
    ] = ensureJsImports(program, pluginImport);

    /* Add the `app.register(FeatureTogglesPlugin)` call in an idempotent way */
    if (!hasRegistrationUsage(program, plugin)) {
      insertJsBefore(program, `return app;`, `app.register(${plugin});`);
    }

    /* Add the `app.register(FeatureTogglesTogglesConfigToken, config)` call in
     * an idempotent way */
    if (!hasRegistrationUsage(program, configToken)) {
      // Add src/config/toggles.js file
      const configFilePath = `${dir}/src/config/toggles.js`;
      if (!(await isFile(configFilePath))) {
        await writeFile(
          configFilePath,
          `
            // @flow
            export default [
              /*feature toggle details*/
            ];
          `
        );
      }

      // Import newly created config file to use in registration
      const configImport = `import featureTogglesConfig from './config/toggles.js';`;
      const [
        // $FlowFixMe
        {default: config},
      ] = ensureJsImports(program, configImport);

      insertJsBefore(
        program,
        `return app;`,
        `__NODE__ && app.register(${configToken}, ${config});`
      );
    }
  });
};

/* Helper functions */

/**
 * Determines whether there are any usages of the provided identifier within
 * an `app.register(...)`
 */
function hasRegistrationUsage(program: any, identifier: string): boolean {
  let found = false;
  program.traverse({
    ExpressionStatement(path) {
      path.traverse({
        CallExpression(path) {
          let isRegisterCall = false;
          if (
            path.node.callee.object &&
            path.node.callee.object.name === 'app' &&
            path.node.callee.property.name === 'register'
          ) {
            isRegisterCall = true;
          }

          // Exit early if this is not an 'app.register' call
          if (isRegisterCall) {
            path.traverse({
              Identifier(path) {
                if (path.node.name === identifier) {
                  found = true;
                }
              },
            });
          }
        },
      });
    },
  });
  return found;
}

/**
 * Determines whether there is a 'return app;' in the given file path's default
 * export.
 */
async function hasAppReturn(filePath: string): Promise<boolean> {
  let foundPath = false;
  await withJsFile(filePath, async program => {
    program.traverse({
      ExportDefaultDeclaration(path) {
        path.traverse({
          BlockStatement(path) {
            path.traverse({
              ReturnStatement(path) {
                if (path.node.argument && path.node.argument.name === 'app') {
                  foundPath = true;
                }
              },
            });
          },
        });
      },
    });
  });
  return foundPath;
}
