/* @flow */

import {Stepper, step, exec} from '@dubstep/core';
import {copy, move, pathExists} from 'fs-extra';
import {checkYarnRegistry} from '../utils/check-yarn-registry.js';
import {getTeams} from '../utils/get-teams.js';
import {promptChoice} from '../utils/prompt-choice.js';
import {prompt} from '../utils/prompt.js';
import {codemodPackageJson} from '../utils/codemod-package-json.js';
import {removeConfigFiles} from '../utils/remove-config-files.js';
import {codemodReadme} from '../utils/codemod-readme.js';
import {replaceNunjucksFile} from '../utils/replace-nunjucks-file.js';
import {initRepo} from '../utils/init-repo.js';
import fs from 'fs';

export type ScaffoldOptions = {
  type: string,
  name: string,
  description: string,
  team: string,
  external: ?boolean,
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

export const scaffold = async ({
  type,
  name,
  description,
  team,
  external,
  localPath,
  skipInstall,
  hoistDeps,
}: ScaffoldOptions) => {
  const project = {type, name, description, team};

  await exec('ussh').catch(() => {}); // required to fetch team list. If command does not exist (e.g. in CI), ignore
  const teams = getTeams(); // don't await here, let promise resolve while user goes through the wizard

  const stepper = new Stepper([
    step('preflight', async () => {
      await checkYarnRegistry();
    }),
    step('template', async () => {
      if (project.type === '') {
        project.type = await promptChoice('Choose a template:', {
          'Web Application': 'website',
          'GraphQL Web Application [!! BETA !!]': 'website-graphql',
          'Fusion.js Plugin': 'fusion-plugin',
          'React Component': 'react-component',
          'Generic Library': 'library',
        });
      }
    }),
    step('project name', async () => {
      if (project.name === '') {
        project.name = await prompt('Project name:');
      }
      if (await pathExists(project.name)) {
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
        localPath || `${__dirname}/../../templates/${project.type}`;
      await copy(templatePath, project.name);
      await move(`${project.name}/dotgitignore`, `${project.name}/.gitignore`, {
        overwrite: true,
      });
    }),
    step('codemod package.json', async () => {
      await codemodPackageJson({...project, hoistDeps});
    }),
    step('codemod config existence', async () => {
      if (hoistDeps) await removeConfigFiles(project.name);
    }),
    step('codemod readme file', async () => {
      await codemodReadme(project);
    }),
    step('run', async () => {
      if (project.type === 'website' || project.type === 'website-graphql') {
        await runWebsiteSteps({...project, external});
      }
    }),
    step('install deps', async () => {
      // eslint-disable-next-line no-console
      console.log('Template scaffolded.');
      if (!skipInstall) {
        // eslint-disable-next-line no-console
        console.log('Installing dependencies. This may take a few seconds...');
        try {
          await exec(`cd ${project.name} && yarn`);
          // eslint-disable-next-line no-console
          console.log(`Done. Run \`cd ${project.name} && yarn dev\` to start`);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(`Scaffolded successfully, but \`yarn install\` failed.`);
          // eslint-disable-next-line no-console
          console.log(`Run \`cd ${project.name} && yarn\` to troubleshoot`);
        }
      }
      if (project.type === 'website') {
        // eslint-disable-next-line no-console
        console.log(
          'Check out the documentation: https://engdocs.uberinternal.com/web'
        );
      } else if (project.type === 'website-graphql') {
        // eslint-disable-next-line no-console
        console.log(
          'Check out the documentation: https://engdocs.uberinternal.com/web/docs/guides/graphql'
        );
      }
    }),
    step('init repo', () => initRepo(project.name, project.team)),
  ]);
  await stepper.run();
};

async function runWebsiteSteps({
  name,
  description,
  team,
  external,
}: ProjectData) {
  const project = {external};

  const stepper = new Stepper([
    step('external', async () => {
      if (typeof project.external !== 'boolean') {
        project.external = await promptChoice(
          'Is this an internal or external application?',
          {
            Internal: false,
            External: true,
          }
        );
      }
    }),
    step('codemod main.js', async () => {
      await replaceNunjucksFile(`${name}/src/main.js`, {name, team});
    }),
    step('codemod udeploy config file', async () => {
      await replaceNunjucksFile(`${name}/udeploy/config/udeploy.yaml`, {
        project: name,
      });
    }),
    step('codemod apollo config', async () => {
      if (fs.existsSync(`${name}/apollo.config.js`)) {
        await replaceNunjucksFile(`${name}/apollo.config.js`, {name});
      }
    }),
    step('codemod pinocchio file', async () => {
      const file = `${name}/udeploy/pinocchio.yaml`;
      await replaceNunjucksFile(file, {
        project: name,
        isExternal: project.external || false,
        assetBase: `https://d3i4yxtzktqr9n.cloudfront.net/${name}`,
      });
    }),
  ]);
  await stepper.run();
}
