/* @flow */

import semver from 'semver';

export const checkMajorVersion = (
  version: string,
  supportedVersion: string
): boolean => {
  return semver.major(version) >= semver.major(supportedVersion);
};
