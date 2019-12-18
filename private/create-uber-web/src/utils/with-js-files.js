// @flow
import {getSpinner, getProgress} from './progress';
import {withJsFile, findFiles} from '@dubstep/core';
import type {BabelPath, Program} from '@ganemone/babel-flow-types';

export async function withJsFiles(
  dir: string = 'src',
  fn: (node: BabelPath<Program>, file: string) => any
) {
  const spinner = getSpinner('Globbing files');
  const files = (await findFiles(`${dir}/**/*.js`)).filter(filterFlowTyped);
  spinner.done();
  const progress = getProgress({total: files.length, title: 'Codemod'});
  for (const file of files) {
    progress.tick(file);
    await withJsFile(file, fn);
  }
}

function filterFlowTyped(file) {
  if (/^flow-typed/.test(file)) {
    return false;
  }
  return true;
}
