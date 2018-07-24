/* @flow */

import {exec} from '@dubstep/core';

export const getUserName = async () => {
  return exec('git config --global --get user.name');
};
