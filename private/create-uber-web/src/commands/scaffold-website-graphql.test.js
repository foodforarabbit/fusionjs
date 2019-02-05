/* @flow */

import inquirer from 'inquirer';
import {remove, pathExists, readJson} from 'fs-extra';
import {readFile} from '@dubstep/core';
import {scaffold} from './scaffold.js';
import {join} from 'path';

jest.setTimeout(100000);

jest.spyOn(console, 'log').mockImplementation(() => {});

test('scaffold website-grapqhl', async () => {
  const name = 'fixtures/website-graphql';
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
      type: 'website-graphql',
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

    const main = await readFile(join(name, 'src/main.js'));
    expect(main.includes('{{')).toBe(false);

    const apolloConfig = await readFile(join(name, 'apollo.config.js'));
    expect(apolloConfig.includes('{{')).toBe(false);
  } finally {
    await remove(name).catch(() => {});
  }
});
