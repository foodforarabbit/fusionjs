// @flow
import {
  hasImport,
  withJsonFile,
  ensureJsImports,
  collapseImports,
  withJsFile,
  visitJsImport,
  type BabelPath,
  type ImportDeclaration,
  t,
} from '@dubstep/core';
import {withJsFiles} from '../../utils/with-js-files';
import {getLatestVersion} from '../../utils/get-latest-version.js';
import log from '../../utils/log';
import type {UpgradeStrategy} from '../../types.js';
import {existsSync as exists} from 'fs';

type InstallOptions = {
  dir: string,
  strategy: UpgradeStrategy,
};

export const codemodApolloHooks = async ({dir, strategy}: InstallOptions) => {
  // update dependencies
  let hasDep = false;
  await withJsonFile(`${dir}/package.json`, async pkg => {
    if (!pkg.dependencies) pkg.dependencies = {};
    if (!pkg.dependencies['react-apollo']) {
      return;
    }
    hasDep = true;
    delete pkg.dependencies['react-apollo'];
    pkg.dependencies['@apollo/react-hooks'] = await getLatestVersion(
      '@apollo/react-hooks',
      strategy
    );
    pkg.dependencies['@apollo/react-testing'] = await getLatestVersion(
      '@apollo/react-hooks',
      strategy
    );
    pkg.dependencies['@apollo/react-components'] = await getLatestVersion(
      '@apollo/react-components',
      strategy
    );
    pkg.dependencies['@apollo/react-common'] = await getLatestVersion(
      '@apollo/react-common',
      strategy
    );
    pkg.dependencies['@apollo/react-hoc'] = await getLatestVersion(
      '@apollo/react-hoc',
      strategy
    );
    pkg.dependencies['@apollo/react-ssr'] = await getLatestVersion(
      '@apollo/react-ssr',
      strategy
    );
    return pkg;
  });
  if (!hasDep) {
    return;
  }
  log.title('Migrating to latest version of apollo packages');

  const mapping = {
    '@apollo/react-hooks': ['useQuery', 'useMutation', 'useSubscription'],
    '@apollo/react-hoc': [
      'withApollo',
      'withMutation',
      'withQuery',
      'withSubscription',
    ],
    '@apollo/react-components': [
      'Mutation',
      'Query',
      'Subscription',
      'ApolloConsumer',
      'ApolloProvider',
      'getApolloContext',
      'resetApolloContext',
    ],
    '@apollo/react-ssr': [
      'getDataFromTree',
      'getMarkupFromTree',
      'renderToStringWithData',
    ],
    '@apollo/react-testing': [
      'createClient',
      'mockObservableLink',
      'mockSingleLink',
      'stripSymbols',
      'wait',
      'MockLink',
      'MockSubscriptionLink',
      'MockedProvider',
    ],
  };
  if (exists(`${dir}/src/uber/ui.js`)) {
    await withJsFile(`${dir}/src/uber/ui.js`, async program => {
      const importStatement = `import {SkipPrepareToken} from 'fusion-react';`;
      if (hasImport(program, importStatement)) {
        return;
      }
      ensureJsImports(program, importStatement);
      program.traverse({
        FunctionDeclaration(path) {
          path.node.body.body.push(
            t.expressionStatement(
              t.callExpression(
                t.memberExpression(
                  t.identifier('app'),
                  t.identifier('register'),
                  false
                ),
                [t.identifier('SkipPrepareToken'), t.booleanLiteral(true)]
              )
            )
          );
        },
      });
    });
  }
  await withJsFiles(`${dir}/src`, async program => {
    program.traverse({
      ImportDeclaration(path: BabelPath<ImportDeclaration>) {
        if (
          path.node.source.value === 'react-apollo' ||
          path.node.source.value === 'react-apollo/test-utils'
        ) {
          const imports = path.node.specifiers.map(specifier => {
            if (specifier.type !== 'ImportSpecifier') {
              throw new Error(`Unable to codemod ${specifier.type}`);
            }
            const name = specifier.imported.name;
            const mappedPackage = Object.keys(mapping).find(mappedPackage => {
              const matches = mapping[mappedPackage];
              return matches.includes(name);
            }, null);
            if (!mappedPackage) {
              throw new Error(`Could not find a mapping for ${name}`);
            }
            const importStatement = `import {${name}} from '${mappedPackage}'`;
            return importStatement;
          });
          path.remove();
          imports.forEach(i => ensureJsImports(program, i));
          collapseImports(program);
        }
      },
    });
    collapseImports(program);
  });

  await withJsFiles(`${dir}/src`, async (program, file) => {
    visitJsImport(
      program,
      `import {MockedProvider} from '@apollo/react-testing';`,
      (path, refPaths) => {
        refPaths.forEach(ref => {
          if (ref.type === 'JSXIdentifier') {
            const parentBlock = ref.findParent(
              parentPath => parentPath.type === 'BlockStatement'
            );
            if (!parentBlock) {
              log(
                `WARNING: Unable to codemod test in ${file} to use ReactTestUtils.act()`
              );
              return;
            }
            let addedAct = false;
            parentBlock.traverse({
              AwaitExpression(awaitPath) {
                if (
                  !awaitPath.removed &&
                  awaitPath.findParent(p => p.type === 'BlockStatement') ===
                    parentBlock &&
                  awaitPath.node.argument.type === 'CallExpression' &&
                  awaitPath.node.argument.callee.type === 'Identifier' &&
                  awaitPath.node.argument.callee.name === 'delay'
                ) {
                  addedAct = true;
                  awaitPath.insertAfter(
                    t.awaitExpression(
                      t.callExpression(t.identifier('act'), [
                        t.arrowFunctionExpression(
                          [],
                          t.blockStatement([
                            t.expressionStatement(
                              t.awaitExpression(
                                t.callExpression(t.identifier('delay'), [
                                  t.numericLiteral(0),
                                ])
                              )
                            ),
                          ]),
                          true
                        ),
                      ])
                    )
                  );
                  awaitPath.remove();
                }
              },
            });
            if (addedAct) {
              ensureJsImports(
                program,
                `import {act} from 'react-dom/test-utils';`
              );
            }
          }
        });
      }
    );
  });
};
