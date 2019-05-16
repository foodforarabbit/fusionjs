/* @flow */

import inquirer from 'inquirer';
import {remove, pathExists, readJson} from 'fs-extra';
import {readFile} from '@dubstep/core';
import {scaffold} from './scaffold.js';
import {join} from 'path';

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
jest.mock('../utils/init-repo.js');

test('scaffold website', async () => {
  const name = 'fixtures/website';
  try {
    await remove(name).catch(() => {});

    jest.spyOn(inquirer, 'prompt').mockImplementation(options => {
      if (options.message.match(/template/)) {
        return {value: options.choices[0]};
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
      type: 'website',
      name: '',
      description: '',
      team: '',
      external: undefined,
      localPath: null,
      skipInstall: true,
      hoistDeps: false,
    }); // no need to test that yarn command works

    expect(await pathExists(name)).toBe(true);

    const data = await readJson(`${name}/package.json`);

    expect(data.name.includes('{{')).toEqual(false);
    // Ensure engines does not use semver
    expect(data.engines.node).toMatch(/^[0-9]/);
    expect(data.engines.npm).toMatch(/^[0-9]/);
    expect(data.engines.yarn).toMatch(/^[0-9]/);

    const main = await readFile(join(name, 'src/main.js'));
    expect(main.includes('{{')).toBe(false);
  } finally {
    await remove(name).catch(() => {});
  }
});

test('prevents bad name', async () => {
  const name = 'fixtures/fixture-staging';

  try {
    await expect(
      scaffold({
        type: 'website',
        name: name,
        description: name,
        team: 'web',
        external: true,
        localPath: null,
        skipInstall: true,
        hoistDeps: false,
      })
    ).rejects.toThrow(/Do not add `-staging`/);
  } finally {
    await remove(name);
  }
});
