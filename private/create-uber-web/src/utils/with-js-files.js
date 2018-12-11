// @flow
import {getSpinner, getProgress} from './progress';
import {withJsFile, findFiles} from '@dubstep/core';

export async function withJsFiles(
  dir: string = 'src',
  fn: (node: NodePath) => any
) {
  const spinner = getSpinner('Globbing files');
  const files = await findFiles(`${dir}/**/*.js`);
  spinner.done();
  const progress = getProgress({total: files.length, title: 'Codemod'});
  for (const file of files) {
    progress.tick(file);
    await withJsFile(file, fn);
  }
}
