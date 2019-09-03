// @flow
import {
  withJsonFile,
  ensureJsImports,
  visitJsImport,
  parseStatement,
  collapseImports,
} from '@dubstep/core';
import {withJsFiles} from '../../utils/with-js-files';
import {getLatestVersion} from '../../utils/get-latest-version.js';
import type {BabelPath, ImportDeclaration} from '@ganemone/babel-flow-types';
import log from '../../utils/log';
import type {UpgradeStrategy} from '../../types.js';
import * as t from '@babel/types';

type InstallOptions = {
  dir: string,
  strategy: UpgradeStrategy,
};

export const codemodFusionApollo = async ({dir, strategy}: InstallOptions) => {
  // update dependencies
  let hasDep = false;
  await withJsonFile(`${dir}/package.json`, async pkg => {
    if (!pkg.dependencies) pkg.dependencies = {};
    if (!pkg.dependencies['fusion-apollo']) {
      return;
    }
    hasDep = true;
    delete pkg.dependencies['fusion-apollo'];
    delete pkg.dependencies['fusion-plugin-apollo-server'];
    pkg.dependencies['fusion-plugin-apollo'] = await getLatestVersion(
      'fusion-plugin-apollo',
      strategy
    );
    pkg.dependencies['@uber/graphql-scripts'] = await getLatestVersion(
      '@uber/graphql-scripts',
      strategy
    );
    delete pkg.dependencies['fusion-apollo-universal-client'];
    pkg.dependencies[
      '@uber/fusion-plugin-graphql-logging-middleware'
    ] = await getLatestVersion(
      '@uber/fusion-plugin-graphql-logging-middleware',
      strategy
    );
    return pkg;
  });
  if (!hasDep) {
    return;
  }
  log.title('Migrating fusion-apollo to fusion-plugin-apollo');
  // replace App import from `fusion-apollo` to `fusion-react`
  // Add overwrite for RenderToken
  await withJsFiles(`${dir}/src`, async program => {
    visitJsImport(
      program,
      `import App from 'fusion-apollo'`,
      (path, refPaths) => {
        ensureJsImports(program, `import App from 'fusion-react';`);
        ensureJsImports(
          program,
          `import {ApolloRenderEnhancer} from 'fusion-plugin-apollo';`
        );
        ensureJsImports(program, `import {RenderToken} from 'fusion-core';`);
        path.node.specifiers = path.node.specifiers.filter(
          s => s.type !== 'ImportDefaultSpecifier'
        );
        if (path.node.specifiers.length === 0) {
          path.remove();
        } else {
          path.node.source.value = 'fusion-plugin-apollo';
        }
        const declaration = refPaths.reduce(
          (expr, ref) =>
            expr || ref.findParent(p => p.type === 'VariableDeclarator'),
          null
        );

        declaration &&
          declaration.parentPath.insertAfter(
            parseStatement(`app.enhance(RenderToken, ApolloRenderEnhancer)`)
          );
      }
    );
    // Rename `ApolloServerEndpointToken` to `GraphQlEndpointToken`
    visitJsImport(
      program,
      `import {ApolloServerEndpointToken} from 'fusion-plugin-apollo-server'`,
      (path, refPaths) => {
        const node = path.node;
        node.specifiers.forEach(spec => {
          if (
            spec.type === 'ImportSpecifier' &&
            spec.imported.name === 'ApolloServerEndpointToken'
          ) {
            spec.imported.name = 'GraphQLEndpointToken';
          }
        });
        refPaths.forEach(ref => {
          ref.node.name = 'GraphQLEndpointToken';
        });
      }
    );
    // remove apollo server registration
    visitJsImport(
      program,
      `import Plugin from 'fusion-plugin-apollo-server'`,
      (path, refPaths) => {
        ensureJsImports(
          program,
          `import GraphQLLoggingMiddleware from '@uber/fusion-plugin-graphql-logging-middleware';`
        );
        const node = path.node;
        refPaths.forEach(r => {
          const parent = r.findParent(p => p.type === 'CallExpression');
          if (parent) {
            parent.insertAfter(
              parseStatement(
                `app.enhance(GraphQLSchemaToken, GraphQLLoggingMiddleware)`
              )
            );
            ensureJsImports(
              program,
              `import {GraphQLSchemaToken} from 'fusion-apollo';`
            );
            parent.remove();
          }
        });
        node.specifiers = node.specifiers.filter(spec => {
          return spec.type !== 'ImportDefaultSpecifier';
        });
        if (node.specifiers.length === 0) {
          path.remove();
        }
      }
    );
    visitJsImport(
      program,
      `import {ApolloClientEndpointToken} from 'fusion-apollo-universal-client'`,
      (path, refPaths) => {
        refPaths.forEach(r => {
          const call = r.findParent(n => n.type === 'CallExpression');
          if (call) {
            call.remove();
          }
        });
        path.node.specifiers = path.node.specifiers.filter(spec => {
          if (
            spec.type === 'ImportSpecifier' &&
            spec.imported.name === 'ApolloClientEndpointToken'
          ) {
            return false;
          }
          return true;
        });
        if (path.node.specifiers.length === 0) {
          path.remove();
        }
      }
    );
    visitJsImport(
      program,
      `import ApolloClient from 'fusion-apollo-universal-client'`,
      (path, refPaths) => {
        path.node.specifiers = path.node.specifiers.map(spec => {
          if (spec.type === 'ImportDefaultSpecifier') {
            return t.importSpecifier(
              t.identifier('ApolloClientPlugin'),
              t.identifier('ApolloClientPlugin')
            );
          }
          return spec;
        });
        refPaths.forEach(ref => {
          ref.replaceWith(t.identifier('ApolloClientPlugin'));
        });
      }
    );
    program.traverse({
      ImportDeclaration(path: BabelPath<ImportDeclaration>) {
        if (
          path.node.source.value === 'fusion-apollo' ||
          path.node.source.value === 'fusion-plugin-apollo-server' ||
          path.node.source.value === 'fusion-apollo-universal-client'
        ) {
          path.node.source.value = 'fusion-plugin-apollo';
        }
      },
    });
    collapseImports(program);
  });
};
