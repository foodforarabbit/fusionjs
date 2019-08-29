// @flow
import {
  ensureJsImports,
  visitJsImport,
  parseStatement,
  withJsonFile,
  writeFile,
} from '@dubstep/core';
import {withJsFiles} from '../../utils/with-js-files';
import {getLatestVersion} from '../../utils/get-latest-version.js';
import log from '../../utils/log';
import type {UpgradeStrategy} from '../../types.js';
import {join, relative, dirname} from 'path';
import {existsSync as exists} from 'fs';

type InstallOptions = {
  dir: string,
  strategy: UpgradeStrategy,
};

export const codemodIntrospectionMatcher = async ({
  dir,
  strategy,
}: InstallOptions) => {
  // update dependencies
  const destFragmentPath = join(dir, '.graphql/fragment-types.json');
  let hasDep = false;
  if (exists(destFragmentPath)) {
    return;
  }
  await withJsonFile(`${dir}/package.json`, async pkg => {
    if (!pkg.dependencies) pkg.dependencies = {};
    if (!pkg.dependencies['fusion-plugin-apollo']) {
      return;
    }
    hasDep = true;
    pkg.dependencies['@uber/graphql-scripts'] = await getLatestVersion(
      '@uber/graphql-scripts',
      strategy
    );
    pkg.dependencies['apollo-cache-inmemory'] = await getLatestVersion(
      '@uber/graphql-scripts',
      strategy
    );
  });
  if (!hasDep) {
    return;
  }

  log.title('Migrating to use IntrospectionFragmentMatcher');

  // replace App import from `fusion-apollo` to `fusion-react`
  // Add overwrite for RenderToken
  await withJsFiles(`${dir}/src`, async (program, file) => {
    // Remove existing registrations on GetApolloClientCacheToken
    visitJsImport(
      program,
      `import {GetApolloClientCacheToken} from 'fusion-plugin-apollo';`,
      (path, refPaths) => {
        refPaths.forEach(refPath => {
          const parentCall = refPath.findParent(
            p => p.type === 'CallExpression'
          );
          parentCall && parentCall.remove();
        });
      }
    );

    // Add registration on GetApolloClientCacheToken using IntrospectionFragmentMatcher
    const calculatedPath = relative(dirname(file), destFragmentPath);
    visitJsImport(
      program,
      `import {ApolloClientPlugin} from 'fusion-plugin-apollo'`,
      (path, refPaths) => {
        ensureJsImports(
          program,
          `import { defaultDataIdFromObject, InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';`
        );
        ensureJsImports(
          program,
          `import {GetApolloClientCacheToken} from 'fusion-plugin-apollo';`
        );
        ensureJsImports(
          program,
          `import introspectionQueryResultData from '${calculatedPath}';`
        );
        const registerCall = refPaths.reduce(
          (expr, ref) =>
            expr || ref.findParent(p => p.type === 'CallExpression'),
          null
        );
        if (!registerCall) {
          throw new Error('Could not find register call for ApolloClientToken');
        }

        registerCall.parentPath.insertAfter(
          parseStatement(
            `
app.register(GetApolloClientCacheToken, ctx => new InMemoryCache({
  addTypename: ctx.method !== 'POST',
  dataIdFromObject: object => object.uuid ? \`\${object.__typename}:\${object.uuid}\` : defaultDataIdFromObject(object),
  fragmentMatcher: new IntrospectionFragmentMatcher({ introspectionQueryResultData }),
}));`
          )
        );
      }
    );
    if (!exists(destFragmentPath)) {
      await writeFile(destFragmentPath, '{}');
    }
  });
};
