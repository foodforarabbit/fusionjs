// @flow
import {exec} from '@dubstep/core';

export function getLatestVersion(dep: string): Promise<string> {
  return exec(`npm info ${dep} version`).then(v => `^${v}`);
}
