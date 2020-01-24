// @flow
import {withJsonFile, withJsFile} from '@dubstep/core';
import * as types from '@babel/types';
import {getLatestVersion} from '../../utils/get-latest-version';
import log from '../../utils/log';
import type {
  BabelPath,
  AssignmentExpression,
  ObjectProperty,
  Types,
} from '@ganemone/babel-flow-types';

const t: Types = types;
const PLUGIN_NAME = 'eslint-plugin-baseui';

type Options = {dir: string};
export const addESLintPluginBaseui = async ({dir}: Options) => {
  await withJsonFile(`${dir}/package.json`, async pkg => {
    if (!pkg.devDependencies) pkg.devDependencies = {};
    if (
      !pkg.dependencies ||
      !pkg.dependencies.baseui ||
      pkg.dependencies[PLUGIN_NAME] ||
      pkg.devDependencies[PLUGIN_NAME]
    ) {
      return;
    }
    log.title('Adding eslint-plugin-baseui');
    pkg.devDependencies[PLUGIN_NAME] = await getLatestVersion(
      PLUGIN_NAME,
      'latest'
    );
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
                t.stringLiteral('baseui/deprecated-theme-api'),
                t.stringLiteral('warn')
              )
            );
            ruleProps.properties.push(
              t.objectProperty(
                t.stringLiteral('baseui/deprecated-component-api'),
                t.stringLiteral('warn')
              )
            );
            ruleProps.properties.push(
              t.objectProperty(
                t.stringLiteral('baseui/no-deep-imports'),
                t.stringLiteral('warn')
              )
            );
            pluginProps.elements.push(t.stringLiteral('baseui'));
          }
        },
      });
    });
  });
};
