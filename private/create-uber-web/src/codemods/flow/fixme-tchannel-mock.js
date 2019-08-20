// @flow
import {withTextFile} from '@dubstep/core';
import isFile from '../utils/is-file.js';

type FixMeTchannelMockOptions = {
  dir: string,
};

export const fixMeTchannelMock = async ({dir}: FixMeTchannelMockOptions) => {
  const testUtilsPath = `${dir}/src/test-utils/test-app.js`;
  if (!(await isFile(testUtilsPath))) return;
  await withTextFile(testUtilsPath, async code => {
    return code
      .replace(
        /( +)(app.register\(TChannelToken, \{\}\));/m,
        '$1// $FlowFixMe\n$1$2'
      )
      .replace(/( +\/\/ \$FlowFixMe\n)+\n*/m, '$1');
  });
};
