/* @flow */

import {getTeams} from './get-teams.js';

test(
  'getTeams works',
  async () => {
    await expect(getTeams()).resolves.toEqual(expect.arrayContaining(['web']));
  },
  10000,
);
