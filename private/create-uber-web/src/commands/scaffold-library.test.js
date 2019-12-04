/* @flow */

import inquirer from 'inquirer';
import {remove, pathExists, readJson} from 'fs-extra';
import {scaffold} from './scaffold.js';

jest.setTimeout(100000);

jest.spyOn(console, 'log').mockImplementation(() => {});

jest.mock('../utils/get-user-name.js', () => ({
  getUserName: () => 'John Doe',
}));
jest.mock('../utils/get-user-email.js', () => ({
  getUserEmail: () => 'johndoe@uber.com',
}));
jest.mock('../utils/get-teams.js', () => ({
  getTeams: () => ['web'],
}));

test('scaffold library', async () => {
  const name = 'fixtures/library';
  try {
    await remove(name).catch(() => {});

    jest.spyOn(inquirer, 'prompt').mockImplementation(options => {
      if (options.message.match(/template/)) {
        return {
          value: options.choices.find(c => c.includes('Generic Library')),
        };
      } else if (options.message.match(/name/)) {
        return {value: name};
      } else if (options.message.match(/description/)) {
        return {value: name};
      } else if (options.message.match(/team/)) {
        return {value: 'web'};
      } else if (options.message.match(/external/)) {
        return {value: options.choices[0]};
      }
    });

    await scaffold({
      type: '',
      name: '',
      description: '',
      team: '',
      external: undefined,
      localPath: null,
      skipInstall: true,
      hoistDeps: false,
      root: process.cwd(),
    }); // no need to test that yarn command works

    expect(await pathExists(name)).toBe(true);

    const data = await readJson(`${name}/package.json`);
    expect(data.engines).toMatchInlineSnapshot(`
      Object {
        "node": ">=8.9.4",
        "npm": ">=5.0.0",
        "yarn": ">=1.0.0",
      }
    `);

    expect(data.name.includes('{{')).toEqual(false);
  } finally {
    await remove(name).catch(() => {});
  }
});
