/* @flow */

import inquirer from 'inquirer';
import fse from 'fs-extra';
import {readFile} from '@dubstep/core';
import {scaffold} from './scaffold.js';

jest.setTimeout(100000);

jest.spyOn(console, 'log').mockImplementation(() => {});

async function testScaffold(name, templateIndex, cb) {
  try {
    await fse.remove(name).catch(() => {});

    jest.spyOn(inquirer, 'prompt').mockImplementation(options => {
      if (options.message.match(/template/)) {
        return {value: options.choices[templateIndex]};
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

    expect(await fse.pathExists(name)).toBe(true);

    const data = await fse.readJson(`${name}/package.json`);

    expect(data.name.includes('{{')).toEqual(false);

    if (cb) await cb();
  } finally {
    await fse.remove(name).catch(() => {});
  }
}

test('scaffold website', async () => {
  await testScaffold('fixtures/website', 0, async () => {
    const main = await readFile('fixtures/website/src/main.js');
    expect(main.includes('{{')).toBe(false);
  });
});
test('scaffold plugin', async () => {
  await testScaffold('fixtures/plugin', 1);
});
test('scaffold component', async () => {
  await testScaffold('fixtures/component', 2);
});
test('scaffold library', async () => {
  await testScaffold('fixtures/library', 3);
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
      }),
    ).rejects.toThrow(/Do not add `-staging`/);
  } finally {
    await fse.remove(name);
  }
});
