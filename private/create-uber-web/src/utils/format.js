// @flow
import {exec} from '@dubstep/core';

export function format(dir: string) {
  return exec(`npx eslint src/ --fix`, {cwd: dir}).catch(e => {});
}
