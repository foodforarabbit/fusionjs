// @flow
import {withJsonFile} from '@dubstep/core';
import {withJsFiles} from '../../utils/with-js-files';
import {getLatestVersion} from '../../utils/get-latest-version.js';
import type {BabelPath, ImportDeclaration} from '@ganemone/babel-flow-types';
import semver from 'semver';
import {resolve, dirname, relative, join} from 'path';
import * as t from '@babel/types';
import log from '../../utils/log';
import {remove} from 'fs-extra';
import type {UpgradeStrategy} from '../../types.js';

type InstallOptions = {
  dir: string,
  strategy: UpgradeStrategy,
};

export const codemodTypedRPCCLI = async ({dir, strategy}: InstallOptions) => {
  // update dependencies
  let shouldCodemod = false;
  await withJsonFile(`${dir}/package.json`, async pkg => {
    if (!pkg.dependencies) pkg.dependencies = {};
    if (!pkg.devDependencies) pkg.devDependencies = {};
    if (pkg.dependencies['@uber/typed-rpc-cli']) {
      pkg.devDependencies['@uber/typed-rpc-cli'] =
        pkg.dependencies['@uber/typed-rpc-cli'];
      delete pkg.dependencies['@uber/typed-rpc-cli'];
    }
    if (!pkg.devDependencies['@uber/typed-rpc-cli']) {
      return;
    }
    // console.log(pkg);
    const version = pkg.devDependencies['@uber/typed-rpc-cli'];
    const {major} = semver.coerce(version);
    if (major >= 2) {
      return;
    }
    shouldCodemod = true;
    pkg.devDependencies['@uber/typed-rpc-cli'] = await getLatestVersion(
      '@uber/typed-rpc-cli',
      strategy
    );
    return pkg;
  });
  if (!shouldCodemod) {
    return;
  }
  log.title('Upgrading @uber/typed-rpc-cli');
  log('Remember to rerun codegeneration commands');
  await remove(join(dir, 'src/gen'));
  // replace App import from `fusion-apollo` to `fusion-react`
  // Add overwrite for RenderToken
  await withJsFiles(`${dir}/src`, async (program, file) => {
    program.traverse({
      ImportDeclaration(path: BabelPath<ImportDeclaration>, state) {
        const source = path.node.source.value;
        if (!source.startsWith('.')) {
          return;
        }
        const resolvedLocation = relative(dir, resolve(dirname(file), source));
        if (resolvedLocation.startsWith('src/gen/')) {
          path.node.source.value = path.node.source.value.replace(
            '/gen/',
            '/__generated__/'
          );
          path.node.specifiers = path.node.specifiers.map(spec => {
            if (
              spec.type === 'ImportSpecifier' &&
              spec.imported.name.endsWith('Type')
            ) {
              return t.importSpecifier(
                t.identifier(spec.local.name),
                t.identifier(spec.imported.name.replace(/Type$/, ''))
              );
            }
            return spec;
          });
        }
      },
    });
  });
};
