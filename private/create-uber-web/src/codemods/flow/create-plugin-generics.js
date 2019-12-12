// @flow

import {findFiles, withTextFile} from '@dubstep/core';
import {ensureFlowComment} from './ensure-flow-comment.js';

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
        if (code.includes('@noflow')) return code;
        code = ensureFlowComment(code);
        return code.replace(/createPlugin\(/g, 'createPlugin<*, *>(');
      });
    })
  );
};
