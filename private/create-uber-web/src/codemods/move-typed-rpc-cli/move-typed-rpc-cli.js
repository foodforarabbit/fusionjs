// @flow

import {withJsonFile} from '@dubstep/core';
import type {UpgradeStrategy} from '../../types.js';
import {getLatestVersion} from '../../utils/get-latest-version';

type InstallOptions = {
  dir: string,
  strategy: UpgradeStrategy,
};

export const moveTypedRPCCLI = async ({dir, strategy}: InstallOptions) => {
  await withJsonFile(`${dir}/package.json`, async pkg => {
    if (!pkg.dependencies) pkg.dependencies = {};
    if (!pkg.devDependencies) pkg.devDependencies = {};
    delete pkg.devDependencies['@uber/typed-rpc-cli'];
    pkg.dependencies['@uber/typed-rpc-cli'] = await getLatestVersion(
      '@uber/typed-rpc-cli',
      strategy
    );
  });
};
