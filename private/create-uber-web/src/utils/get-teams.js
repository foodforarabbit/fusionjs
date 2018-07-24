/* @flow */

import {exec} from '@dubstep/core';

export const getTeams = async () => {
  // note: requires ussh token
  const data = await exec('ssh gitolite@code.uber.internal namespaces');
  return data.split('\n').filter(Boolean);
};
