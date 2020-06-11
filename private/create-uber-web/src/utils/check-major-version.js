/* @flow */

import semver from 'semver';

export const checkMajorVersion = (
  semverString: string,
  supportedVersion: string
): boolean => {
  const versionToCheck = semver.minVersion(semverString).version;
  return semver.major(versionToCheck) >= semver.major(supportedVersion);
};
