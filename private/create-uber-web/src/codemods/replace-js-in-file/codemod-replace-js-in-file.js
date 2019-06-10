// @flow
import {withJsFile, replaceJs} from '@dubstep/core';

type ReplaceOptions = {
  fileName: string,
  source: string,
  target: string,
};

export const replaceJSInFile = async ({
  fileName,
  source,
  target,
}: ReplaceOptions) => {
  await withJsFile(fileName, async program => {
    replaceJs(program, source, target);
  });
};
