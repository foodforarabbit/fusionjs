/* @flow */

import packageJson from '../../package.json';

export const getNpmVersion = async () => {
  return packageJson.engines.npm;
};
