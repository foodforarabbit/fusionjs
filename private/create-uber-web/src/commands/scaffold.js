/* @flow */

import {Stepper, step, exec} from '@dubstep/core';
import fse from 'fs-extra';
import {checkYarnRegistry} from '../utils/check-yarn-registry.js';
import {getTeams} from '../utils/get-teams.js';
import {promptChoice} from '../utils/prompt-choice.js';
import {prompt} from '../utils/prompt.js';
import {codemodPackageJson} from '../utils/codemod-package-json.js';
import {codemodReadme} from '../utils/codemod-readme.js';
import {replaceNunjucksFile} from '../utils/replace-nunjucks-file.js';

export type ScaffoldOptions = {
  localPath: ?string,
  skipInstall: ?boolean,
};

export type ProjectData = {
  type: string,
  name: string,
  description: string,
  team: string,
};

export default async ({localPath, skipInstall}: ScaffoldOptions) => {
  const project = {type: '', name: '', description: '', team: ''};

  await exec('ussh').catch(() => {}); // required to fetch team list. If command does not exist (e.g. in CI), ignore
  const teams = getTeams(); // don't await here, let promise resolve while user goes through the wizard

  const stepper = new Stepper([
    step('preflight', async () => {
      await checkYarnRegistry();
    }),
    step('template', async () => {
      project.type = await promptChoice('Choose a template:', {
        'Web Application': 'website',
        'Fusion.js Plugin': 'fusion-plugin',
        'React Component': 'react-component',
        'Generic Library': 'library',
      });
    }),
    step('project name', async () => {
      project.name = await prompt('Project name:');
      if (await fse.pathExists(project.name)) {
        throw new Error(
          `A folder with the name ${project.name} already exists`,
        );
      }
      if (project.name.endsWith('staging')) {
        throw new Error(
          'Do not add `-staging` at the end of the project name. It can cause routing issues when you provision',
        );
      }
    }),
    step('project description', async () => {
      project.description = await prompt('Project description:');
    }),
    step('team', async () => {
      project.team = await promptChoice('Project team:', await teams);
    }),
    step('copy', async () => {
      const templatePath =
        localPath || `${__dirname}/../../templates/${project.type}`;
      await fse.copy(templatePath, project.name);
    }),
    step('codemod package.json', async () => {
      await codemodPackageJson(project);
    }),
    step('codemod readme file', async () => {
      await codemodReadme(project);
    }),
    step('run', async () => {
      if (project.type === 'website') await runWebsiteSteps(project);
    }),
    step('install deps', async () => {
      console.log('Template scaffolded.');
      if (!skipInstall) {
        console.log('Installing dependencies...');
        try {
          await exec(`cd ${project.name} && yarn`);
          console.log(`Done. Run \`cd ${project.name} && yarn dev\` to start`);
        } catch (e) {
          console.log(`Scaffolded successfully, but \`yarn install\` failed.`);
          console.log(`Run \`cd ${project.name} && yarn\` to troubleshoot`);
        }
      }
    }),
  ]);
  await stepper.run();
};

async function runWebsiteSteps({name, description, team}: ProjectData) {
  const project = {external: false};

  const stepper = new Stepper([
    step('external', async () => {
      project.external = await promptChoice(
        'Is this an internal or external application?',
        {
          Internal: false,
          External: true,
        },
      );
    }),
    step('codemod udeploy config file', async () => {
      await replaceNunjucksFile(`${name}/udeploy/config/udeploy.yaml`, {
        project: name,
      });
    }),
    step('codemod pinocchio file', async () => {
      const file = `${name}/udeploy/pinocchio.yaml`;
      await replaceNunjucksFile(file, {
        project: name,
        isExternal: project.external,
        assetBase: `https://d3i4yxtzktqr9n.cloudfront.net/${name}`,
      });
    }),
  ]);
  await stepper.run();
}
