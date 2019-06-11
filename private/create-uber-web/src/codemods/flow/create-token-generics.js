// @flow

import {findFiles, withTextFile} from '@dubstep/core';

type CreateTokenGenericsOptions = {
  dir: string,
};

export const addCreateTokenGenerics = async ({
  dir,
}: CreateTokenGenericsOptions) => {
  const files = await findFiles(dir + '/src/**/*.js');
  return Promise.all(
    files.map(file => {
      return withTextFile(file, async code => {
        if (code.includes('@noflow')) return code;
        return code.replace(/createToken\(/g, 'createToken<*>(');
      });
    })
  );
};
