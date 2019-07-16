// @flow
import {
  withJsonFile,
  withJsFile,
  ensureJsImports,
  insertJsBefore,
} from '@dubstep/core';
import {getLatestVersion} from '../../utils/get-latest-version.js';
import {stringLiteral} from '@babel/types';
import type {UpgradeStrategy} from '../../types.js';

type InstallOptions = {
  dir: string,
  strategy: UpgradeStrategy,
};

export const installIntrospect = async ({dir, strategy}: InstallOptions) => {
  if (strategy === 'curated') strategy = 'latest';
  let serviceName = '';
  await withJsonFile(`${dir}/package.json`, async pkg => {
    serviceName = pkg.name;
    if (serviceName === '{{website-template}}') serviceName = '{{name}}';
    const deps = [
      'fusion-plugin-introspect',
      '@uber/fusion-metrics',
      '@uber/fusion-plugin-heatpipe',
    ];
    if (!pkg.dependencies) pkg.dependencies = {};
    for (const dep of deps) {
      if (!pkg.dependencies[dep]) {
        pkg.dependencies[dep] = await getLatestVersion(dep, strategy);
      }
    }
    return pkg;
  });
  await withJsFile(`${dir}/src/main.js`, async program => {
    // add imports
    const [{default: introspect}] = ensureJsImports(
      program,
      `import introspect from 'fusion-plugin-introspect';`
    );
    const [{default: store}] = ensureJsImports(
      program,
      `import metricsStore from '@uber/fusion-metrics';`
    );
    // $FlowFixMe
    const [{HeatpipeToken}] = ensureJsImports(
      program,
      `import {HeatpipeToken} from '@uber/fusion-plugin-heatpipe';`
    );

    // add app.register(introspect(...)) call
    program.traverse({
      ExpressionStatement(path) {
        path.traverse({
          Identifier(path) {
            if (path.node.name === introspect)
              path.getStatementParent().remove();
          },
        });
      },
    });
    insertJsBefore(
      program,
      `return app;`,
      `
      app.register(
        ${introspect}(app, {
          deps: {heatpipe: ${HeatpipeToken}},
          store: ${store}(),
        })
      );
    `
    );

    // CSRF protection whitelist
    program.traverse({
      ArrayExpression({node}) {
        const hasErrors = node.elements.find(el => el.value === '/_errors');
        const hasDiagnostics = node.elements.find(
          el => el.value === '/_diagnostics'
        );
        if (hasErrors && !hasDiagnostics) {
          node.elements.push(stringLiteral('/_diagnostics'));
        }
      },
    });
  });
};
