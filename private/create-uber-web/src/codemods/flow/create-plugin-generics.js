// @flow

import {findFiles, withTextFile} from '@dubstep/core';

type CreatePluginGenericsOptions = {
  dir: string,
};

export const addCreatePluginGenerics = async ({
  dir,
}: CreatePluginGenericsOptions) => {
  const files = await findFiles(dir + '/src/**/*.js');
  return Promise.all(
    files.map(file => {
      return withTextFile(file, async code => {
        return code.replace(/createPlugin\(/g, 'createPlugin<*, *>(');
      });
    })
  );
};
