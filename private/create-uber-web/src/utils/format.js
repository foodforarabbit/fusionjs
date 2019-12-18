// @flow
import {exec} from './exec.js';

export function format(dir: string) {
  return exec(`npx eslint src/ --fix`, 'Running `eslint --fix`', {
    cwd: dir,
  }).catch(e => {});
}
