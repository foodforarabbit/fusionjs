/* @flow */

import inquirer from 'inquirer';
import {remove, pathExists, readJson} from 'fs-extra';
import {scaffold} from './scaffold.js';

jest.setTimeout(100000);

jest.spyOn(console, 'log').mockImplementation(() => {});

test('scaffold plugin', async () => {
  const name = 'fixtures/plugin';
  try {
    await remove(name).catch(() => {});

    jest.spyOn(inquirer, 'prompt').mockImplementation(options => {
      if (options.message.match(/template/)) {
        return {value: options.choices[1]};
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
    }); // no need to test that yarn command works

    expect(await pathExists(name)).toBe(true);

    const data = await readJson(`${name}/package.json`);

    expect(data.name.includes('{{')).toEqual(false);
  } finally {
    await remove(name).catch(() => {});
  }
});
