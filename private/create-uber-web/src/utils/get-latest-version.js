// @flow
import {exec} from '@dubstep/core';

export function getLatestVersion(dep: string, edge: boolean): Promise<string> {
  if (edge) {
    return exec(`npm info ${dep} versions --json`).then(list => {
      return `^${JSON.parse(list).pop()}`;
    });
  } else {
    return exec(`npm info ${dep} version`).then(v => `^${v}`);
  }
}
