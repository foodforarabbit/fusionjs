/* @flow */

import packageJson from '../../package.json';

export const getNodeVersion = async () => {
  return packageJson.engines.node;
};
