// @flow
import {withJsonFile, withJsFile} from '@dubstep/core';
import {getLatestVersion} from '../../utils/get-latest-version.js';
import type {
  BabelPath,
  AssignmentExpression,
  ObjectProperty,
  Types,
} from '@ganemone/babel-flow-types';
import log from '../../utils/log';
import type {UpgradeStrategy} from '../../types.js';
import * as types from '@babel/types';

const t: Types = types;

type InstallOptions = {
  dir: string,
  strategy: UpgradeStrategy,
};

export const addESLintPluginGraphQL = async ({
  dir,
  strategy,
}: InstallOptions) => {
  // update dependencies
  let hasDep = false,
    usesGraphql = true;
  await withJsonFile(`${dir}/package.json`, async pkg => {
    if (!pkg.dependencies) pkg.dependencies = {};
    if (!pkg.devDependencies) pkg.devDependencies = {};
    if (!pkg.scripts) pkg.scripts = {};

    if (!(pkg.dependencies.graphql || pkg.devDependencies.graphql)) {
      usesGraphql = false;
      return;
    }

    delete pkg.scripts['validate-queries'];
    if (pkg.scripts['posttest-integration']) {
      pkg.scripts['posttest-integration'] = pkg.scripts['posttest-integration']
        .replace('yarn validate-queries && ', '')
        .replace('yarn validate-queries', '');
    }

    if (
      pkg.dependencies['eslint-plugin-graphql'] ||
      pkg.devDependencies['eslint-plugin-graphql']
    ) {
      hasDep = true;
      return;
    }
    pkg.dependencies['eslint-plugin-graphql'] = await getLatestVersion(
      'eslint-plugin-graphql',
      strategy
    );
    return pkg;
  });
  if (hasDep || !usesGraphql) {
    return;
  }
  log.title('Adding eslint-plugin-graphql');

  await withJsFile(`${dir}/.eslintrc.js`, async program => {
    program.traverse({
      AssignmentExpression(path: BabelPath<AssignmentExpression>) {
        if (
          path.node.left.type === 'MemberExpression' &&
          path.node.left.property.name === 'exports' &&
          path.node.right.type === 'ObjectExpression'
        ) {
          const properties = path.node.right.properties;
          // $FlowFixMe
          let rules: ?ObjectProperty = properties.find(
            prop =>
              prop.type === 'ObjectProperty' &&
              prop.key.type === 'Identifier' &&
              prop.key.name === 'rules' &&
              prop.value.type === 'ObjectExpression'
          );
          // $FlowFixMe
          let plugins: ?ObjectProperty = properties.find(
            prop =>
              prop.type === 'ObjectProperty' &&
              prop.key.type === 'Identifier' &&
              prop.key.name === 'plugins' &&
              prop.value.type === 'ArrayExpression'
          );
          if (!rules) {
            rules = t.objectProperty(
              t.stringLiteral('rules'),
              t.objectExpression([])
            );
            properties.push(rules);
          }
          if (!plugins) {
            plugins = t.objectProperty(
              t.stringLiteral('plugins'),
              t.arrayExpression([])
            );
            properties.push(plugins);
          }
          if (rules.value.type !== 'ObjectExpression') {
            throw new Error(
              `Expected eslint rules to be ObjectExpression. Instead found: ${rules.value.type}`
            );
          }
          if (plugins.value.type !== 'ArrayExpression') {
            throw new Error(
              `Expected eslint plugins to be ArrayExpression. Instead found: ${plugins.value.type}`
            );
          }
          const ruleProps = rules.value;
          const pluginProps = plugins.value;
          ruleProps.properties.push(
            t.objectProperty(
              t.stringLiteral('graphql/template-strings'),
              t.arrayExpression([
                t.stringLiteral('error'),
                t.objectExpression([
                  t.objectProperty(
                    t.stringLiteral('env'),
                    t.stringLiteral('apollo')
                  ),
                  t.objectProperty(
                    t.stringLiteral('schemaJson'),
                    t.callExpression(t.identifier('require'), [
                      t.stringLiteral('./.graphql/schema.json'),
                    ])
                  ),
                ]),
              ])
            )
          );
          pluginProps.elements.push(t.stringLiteral('graphql'));
        }
      },
    });
  });
};
