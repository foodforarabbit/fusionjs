// @flow

import {
  withJsonFile,
  withJsFile,
  ensureJsImports,
  insertJsBefore,
  writeFile,
} from '@dubstep/core';

import isFile from '../utils/is-file.js';
import hasRegistrationUsage from '../utils/has-registration-usage.js';
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
  const uberDir = `${dir}/src/uber`;
  const configFilePath = `${dir}/src/config/toggles.js`;
  let hasDep = false;

  await withJsonFile(`${dir}/package.json`, async pkg => {
    hasDep =
      pkg.dependencies &&
      pkg.dependencies['@uber/fusion-plugin-feature-toggles-react'];
  });

  if (hasDep) {
    return;
  }

  if (!(await isFile(mainFilePath)) || !(await hasAppReturn(mainFilePath))) {
    console.error(
      'Unable to register Feature Toggles plugin.  Please manually install @uber/fusion-plugin-feature-toggles-react.'
    );
    return;
  }

  // Add @uber/fusion-plugin-feature-toggles-react package as a dependency
  await addPackage({
    name: '@uber/fusion-plugin-feature-toggles-react',
    dir,
    strategy,
  });

  // Add @uber/fusion-plugin-marketing package - which is a peer dependency of feature toggles plugin - as a dependency
  await addPackage({
    name: '@uber/fusion-plugin-marketing',
    dir,
    strategy,
  });

  // graphql package style
  if (await isFile(uberDir)) {
    await writeFile(
      `${uberDir}/xp.js`,
      `
import FeatureTogglesPlugin, {
  FeatureTogglesTogglesConfigToken
} from '@uber/fusion-plugin-feature-toggles-react';
import type FusionApp from 'fusion-core';
import featureTogglesConfig from '../config/toggles.js';

export default function initXP(app: FusionApp) { 
  app.register(FeatureTogglesPlugin);
  if (__NODE__) {
    app.register(FeatureTogglesTogglesConfigToken, featureTogglesConfig); 
  }
}
`
    );
    if (!(await isFile(configFilePath))) {
      await writeFile(
        configFilePath,
        `// @flow
export default [
  /*feature toggle details*/
];`
      );
    }
    await withJsFile(mainFilePath, async program => {
      ensureJsImports(program, `import initXP from './uber/xp.js'`);
      insertJsBefore(program, `return app;`, `initXP(app);`);
    });
  } else {
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
  }
};

/* Helper functions */

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
