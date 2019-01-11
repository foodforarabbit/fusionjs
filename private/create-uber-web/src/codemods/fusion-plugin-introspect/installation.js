// @flow
import {
  withJsonFile,
  withJsFile,
  ensureJsImports,
  insertJsBefore,
} from '@dubstep/core';
import {getLatestVersion} from '../../utils/get-latest-version.js';
import {stringLiteral} from '@babel/types';

type InstallOptions = {
  dir: string,
  edge: boolean,
};

export const installIntrospect = async ({dir, edge}: InstallOptions) => {
  let serviceName = '';
  await withJsonFile(`${dir}/package.json`, async pkg => {
    serviceName = pkg.name;
    const deps = [
      'fusion-plugin-introspect',
      '@uber/fusion-metrics',
      '@uber/fusion-plugin-heatpipe',
    ];
    if (!pkg.dependencies) pkg.dependencies = {};
    for (const dep of deps) {
      if (!pkg.dependencies[dep]) {
        pkg.dependencies[dep] = await getLatestVersion(dep, edge);
      }
    }
  });
  await withJsFile(`${dir}/src/main.js`, program => {
    // add imports
    const [{default: introspect}] = ensureJsImports(
      program,
      `import introspect from 'fusion-plugin-introspect';`
    );
    const [{default: store}] = ensureJsImports(
      program,
      `import metricsStore from '@uber/fusion-metrics';`
    );
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
          store: !__DEV__ ? ${store}({service: '${serviceName}'}) : undefined,
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
