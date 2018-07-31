/* @flow */

import packageJson from '../../package.json';

export const getYarnVersion = async () => {
  return packageJson.engines.yarn;
};
