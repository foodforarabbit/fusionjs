/* @flow */

import inquirer from 'inquirer';
import fse from 'fs-extra';
import scaffold from './scaffold.js';

jest.setTimeout(30000);

jest.spyOn(console, 'log').mockImplementation(() => {});

test('scaffold', async () => {
  for (let i = 0; i < 4; i++) {
    await run('fixtures/fixture' + i, i);
  }

  async function run(name, templateIndex) {
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

      await scaffold({localPath: null, skipInstall: true, hoistDeps: false}); // no need to test that yarn command works

      expect(await fse.pathExists(name)).toBe(true);

      const data = await fse.readJson(`${name}/package.json`);

      expect(data.name.includes('{{')).toEqual(false);
    } finally {
      await fse.remove(name).catch(() => {});
    }
  }
});

test('prevents bad name', async () => {
  const name = 'fixtures/fixture-staging';

  try {
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

    await expect(
      scaffold({localPath: null, skipInstall: true, hoistDeps: false}),
    ).rejects.toThrow(/Do not add `-staging`/);
  } finally {
    await fse.remove(name);
  }
});
