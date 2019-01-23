// @flow
import {withTextFile} from '@dubstep/core';

type FixMeTchannelMockOptions = {
  dir: string,
};

export const fixMeTchannelMock = async ({dir}: FixMeTchannelMockOptions) => {
  await withTextFile(`${dir}/src/test-utils/test-app.js`, code => {
    return code
      .replace(
        /( +)(app.register\(TChannelToken, \{\}\));/m,
        '$1// $FlowFixMe\n$1$2'
      )
      .replace(/( +\/\/ \$FlowFixMe\n)+\n*/m, '$1');
  });
};
