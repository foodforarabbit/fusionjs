// @flow
import {Stepper, step, exec} from '@dubstep/core';
import {copy, move, pathExists} from 'fs-extra';
import {checkYarnRegistry} from '../utils/check-yarn-registry.js';
import {getTeams} from '../utils/get-teams.js';
import {promptChoice} from '../utils/prompt-choice.js';
import {prompt} from '../utils/prompt.js';
import {codemodPackageJson} from '../utils/codemod-package-json.js';
import {removeConfigFiles} from '../utils/remove-config-files.js';
import {codemodReadme} from '../utils/codemod-readme.js';
import {initRepo} from '../utils/init-repo.js';

export type Options = {
  root: string,
  project: ProjectData,
  localPath: ?string,
  skipInstall: boolean,
  hoistDeps: boolean,
};

export type ProjectData = {
  type: string,
  name: string,
  description: string,
  team: string,
  external: ?boolean,
};

export const scaffoldFusionPlugin = async ({
  root,
  project,
  hoistDeps,
  localPath,
  skipInstall,
}: Options) => {
  await exec('ussh').catch(() => {}); // required to fetch team list. If command does not exist (e.g. in CI), ignore
  const teams = getTeams(); // don't await here, let promise resolve while user goes through the wizard

  const stepper = new Stepper([
    step('preflight', async () => {
      await checkYarnRegistry();
    }),
    step('project name', async () => {
      if (project.name === '') {
        project.name = await prompt('Project name:');
      }
      if (await pathExists(`${root}/${project.name}`)) {
        throw new Error(
          `A folder with the name ${project.name} already exists`
        );
      }
      if (project.name.endsWith('staging')) {
        throw new Error(
          'Do not add `-staging` at the end of the project name. It can cause routing issues when you provision'
        );
      }
    }),
    step('project description', async () => {
      if (project.description === '') {
        project.description = await prompt('Project description:');
      }
    }),
    step('team', async () => {
      if (project.team === '') {
        project.team = await promptChoice('Project team:', await teams);
      }
    }),
    step('copy', async () => {
      const templatePath =
        localPath || `${__dirname}/../../templates/template-${project.type}`;
      await copy(templatePath, `${root}/${project.name}`);
      await move(`${project.name}/dotgitignore`, `${project.name}/.gitignore`, {
        overwrite: true,
      });
    }),
    step('codemod package.json', async () => {
      await codemodPackageJson({
        path: `${root}/${project.name}/package.json`,
        ...project,
        hoistDeps,
      });
    }),
    step('codemod config existence', async () => {
      if (hoistDeps) await removeConfigFiles(`${root}/${project.name}`);
    }),
    step('codemod readme file', async () => {
      await codemodReadme({
        path: `${root}/${project.name}/README.md`,
        ...project,
      });
    }),
    step('install deps', async () => {
      // eslint-disable-next-line no-console
      console.log('Template scaffolded.');
      if (!skipInstall) {
        // eslint-disable-next-line no-console
        console.log('Installing dependencies. This may take a few seconds...');
        try {
          await exec(`yarn`, {
            cwd: `${root}/${project.name}`,
          });
          // eslint-disable-next-line no-console
          console.log(`Done. Run \`cd ${project.name} && yarn dev\` to start`);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(`Scaffolded successfully, but \`yarn install\` failed.`);
          // eslint-disable-next-line no-console
          console.log(`Run \`cd ${project.name} && yarn\` to troubleshoot`);
        }
      }
    }),
    step('init repo', () => initRepo(root, project.name, project.team)),
  ]);

  await stepper.run();
};
