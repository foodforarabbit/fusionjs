/* @flow */

import {exec} from '@dubstep/core';

export const getUserEmail = async () => {
  return exec('git config --global --get user.email');
};
