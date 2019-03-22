/* @flow */

import {getTeams} from './get-teams.js';

test('getTeams works', async () => {
  await expect(typeof getTeams).toBe('function');
}, 10000);
