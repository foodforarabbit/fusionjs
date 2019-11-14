// @flow
import {Stepper, step, exec} from '@dubstep/core';
import {copy, move} from 'fs-extra';
import {checkYarnRegistry} from '../utils/check-yarn-registry.js';
import {getTeams} from '../utils/get-teams.js';
import {promptChoice} from '../utils/prompt-choice.js';
import {prompt} from '../utils/prompt.js';
import {codemodPackageJson} from '../utils/codemod-package-json.js';
import {removeConfigFiles} from '../utils/remove-config-files.js';
import {codemodReadme} from '../utils/codemod-readme.js';
import {replaceNunjucksFile} from '../utils/replace-nunjucks-file.js';
import {initRepo} from '../utils/init-repo.js';
import {checkProjectName} from '../utils/check-project-name.js';

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

export const scaffoldWebsite = async ({
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
      project.name = await checkProjectName(project.name, root);
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
      await move(
        `${root}/${project.name}/dotgitignore`,
        `${root}/${project.name}/.gitignore`,
        {
          overwrite: true,
        }
      );
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
    step('external', async () => {
      if (typeof project.external !== 'boolean') {
        project.external = await promptChoice(
          'Is this app for public or internal use? (Public apps are accessible by anyone and serve assets from CDN. Internal apps are behind OneLogin and only accessible by employees.)',
          {
            Public: true,
            Internal: false,
          }
        );
      }
    }),
    step('codemod main.js', async () => {
      await replaceNunjucksFile(`${root}/${project.name}/src/main.js`, {
        name: project.name,
        team: project.team,
      });
    }),
    step('codemod udeploy config file', async () => {
      await replaceNunjucksFile(
        `${root}/${project.name}/udeploy/config/udeploy.yaml`,
        {
          project: project.name,
        }
      );
    }),
    step('codemod pinocchio file', async () => {
      const file = `${root}/${project.name}/udeploy/pinocchio.yaml`;
      await replaceNunjucksFile(file, {
        project: project.name,
        isExternal: project.external || false,
        assetBase: `https://d3i4yxtzktqr9n.cloudfront.net/${project.name}`,
      });
    }),
    step('codemod sentry configuration', async () => {
      await replaceNunjucksFile(
        `${root}/${project.name}/src/config/sentry.js`,
        {
          name: project.name,
        }
      );
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
      // eslint-disable-next-line no-console
      console.log(
        'Check out the documentation: https://engdocs.uberinternal.com/web'
      );
    }),
    step('init repo', () => initRepo(root, project.name, project.team)),
  ]);

  await stepper.run();
};
