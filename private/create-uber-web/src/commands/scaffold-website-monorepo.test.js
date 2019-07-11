/* @flow */

import inquirer from 'inquirer';
import {copy, remove, pathExists, readJson} from 'fs-extra';
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

test('scaffold monorepo website', async () => {
  const base = 'fixtures/monorepo-base';
  const root = 'fixtures/website';
  const name = 'test-project';
  try {
    await remove(root).catch(() => {});
    await copy(base, root);
    await jest.spyOn(inquirer, 'prompt').mockImplementation(options => {
      if (options.message.match(/template/)) {
        return {
          value: options.choices.find(c =>
            c.includes('Web Application [web-code monorepo]')
          ),
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
      type: 'website-monorepo',
      name: '',
      description: '',
      team: '',
      external: undefined,
      localPath: null,
      skipInstall: true,
      hoistDeps: false,
      root,
    }); // no need to test that jazelle command works

    expect(await pathExists(`${root}/projects/${name}`)).toBe(true);

    const data = await readJson(`${root}/projects/${name}/package.json`);

    expect(data.name.includes('{{')).toEqual(false);
    // Ensure engines does not use semver
    expect(data.engines.node).toMatch(/^[0-9]/);
    expect(data.engines.npm).toMatch(/^[0-9]/);
    expect(data.engines.yarn).toMatch(/^[0-9]/);

    const main = await readFile(join(`${root}/projects/${name}/src/main.js`));
    expect(main.includes('{{')).toBe(false);

    const manifest = await readJson(`${root}/manifest.json`);
    expect(manifest.projects.includes(`projects/${name}`)).toBe(true);

    expect(await pathExists(`${root}/udeploy/pinocchio/${name}.yaml`)).toBe(
      true
    );
    const pinnochio = await readFile(`${root}/udeploy/pinocchio/${name}.yaml`);
    expect(pinnochio.includes('{{')).toBe(false);

    expect(await pathExists(`${root}/udeploy/config/udeploy.yaml`)).toBe(true);
    const udeploy = await readFile(`${root}/udeploy/config/udeploy.yaml`);
    expect(udeploy.includes(`${name}:\n  startup_time_wait: 15`)).toBe(true);

    expect(await pathExists(`${root}/projects/${name}/udeploy`)).toBe(false);
  } finally {
    // await remove(root).catch(() => {});
  }
});
