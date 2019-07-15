// @flow
import {
  withJsonFile,
  parseStatement,
  ensureJsImports,
  visitJsImport,
} from '@dubstep/core';
import log from '../../utils/log.js';
import {withJsFiles} from '../../utils/with-js-files.js';
import {getLatestVersion} from '../../utils/get-latest-version.js';
import type {UpgradeStrategy} from '../../types.js';

type MigrateOptions = {
  dir: string,
  strategy: UpgradeStrategy,
};

export const migrateGraphQLMetrics = async ({
  dir,
  strategy,
}: MigrateOptions) => {
  await withJsonFile(`${dir}/package.json`, async pkg => {
    log.title('GraphQL Metrics');
    if (!pkg.dependencies) {
      return;
    }
    delete pkg.dependencies['@uber/fusion-plugin-graphql-logging-middleware'];
    pkg.dependencies[
      '@uber/fusion-plugin-graphql-metrics'
    ] = await getLatestVersion('@uber/fusion-plugin-graphql-metrics', strategy);
  });
  await withJsFiles(dir, path => {
    visitJsImport(
      path,
      `import GraphQLLoggingMiddleware from '@uber/fusion-plugin-graphql-logging-middleware'`,
      (importPath, refs) => {
        refs.forEach(ref => {
          if (ref.parentPath.type !== 'CallExpression') {
            // eslint-disable-next-line no-console
            console.log(
              `WARNING: Unsure how to migrate GraphQLLoggingMiddleware with parent path: ${ref.parentPath.type}`
            );
            return;
          }
          ref.parentPath.replaceWith(
            parseStatement(
              `app.register(GetApolloClientLinksToken, GraphQLMetricsPlugin);`
            )
          );
        });
        ensureJsImports(
          path,
          `import {GetApolloClientLinksToken} from 'fusion-plugin-apollo';\n`
        );
        ensureJsImports(
          path,
          `import GraphQLMetricsPlugin from '@uber/fusion-plugin-graphql-metrics';\n`
        );
        importPath.remove();
      }
    );
  });
};
