// @flow
import {
  Stepper,
  step,
  exec,
  readFile,
  writeFile,
  removeFile,
} from '@dubstep/core';
import {copy, move, pathExists} from 'fs-extra';
import {resolve} from 'path';
import {checkYarnRegistry} from '../utils/check-yarn-registry.js';
import {getTeams} from '../utils/get-teams.js';
import {promptChoice} from '../utils/prompt-choice.js';
import {prompt} from '../utils/prompt.js';
import {codemodPackageJson} from '../utils/codemod-package-json.js';
import {removeConfigFiles} from '../utils/remove-config-files.js';
import {codemodReadme} from '../utils/codemod-readme.js';
import {replaceNunjucksFile} from '../utils/replace-nunjucks-file.js';
import {checkAppMonorepoRoot} from '../utils/check-app-monorepo-root.js';
import {addMonorepoProject} from '../utils/add-monorepo-project.js';

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

export const scaffoldWebsiteMonorepo = async ({
  root,
  project,
  hoistDeps,
  localPath,
  skipInstall,
}: Options) => {
  await exec('ussh').catch(() => {}); // required to fetch team list. If command does not exist (e.g. in CI), ignore
  const teams = getTeams(); // don't await here, let promise resolve while user goes through the wizard

  const stepper = new Stepper([
    step('check monorepo root', async () => {
      if (!(await checkAppMonorepoRoot(root))) {
        throw new Error(
          `The monorepo scaffold must be run from the app monorepo root directory.`
        );
      }
    }),
    step('preflight', async () => {
      await checkYarnRegistry();
    }),
    step('project name', async () => {
      if (project.name === '') {
        project.name = `${await prompt('Project name:')}`;
      }
      if (await pathExists(`${root}/projects/${project.name}`)) {
        throw new Error(`The project ${project.name} already exists`);
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

      await copy(templatePath, `${root}/projects/${project.name}`);

      await move(
        `${root}/projects/${project.name}/dotgitignore`,
        `${root}/projects/${project.name}/.gitignore`,
        {
          overwrite: true,
        }
      );
    }),
    step('codemod package.json', async () => {
      await codemodPackageJson({
        path: `${root}/projects/${project.name}/package.json`,
        ...project,
        hoistDeps,
      });
    }),
    step('codemod config existence', async () => {
      if (hoistDeps)
        await removeConfigFiles(`${root}/projects/${project.name}`);
    }),
    step('codemod readme file', async () => {
      await codemodReadme({
        path: `${root}/projects/${project.name}/README.md`,
        ...project,
      });
    }),
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
      await replaceNunjucksFile(
        `${root}/projects/${project.name}/src/main.js`,
        {
          name: project.name,
          team: project.team,
        }
      );
    }),
    step('codemod pinocchio file', async () => {
      const file = `${root}/projects/${project.name}/udeploy/pinocchio.yaml`;
      await replaceNunjucksFile(file, {
        project: project.name,
        isExternal: project.external || false,
        assetBase: `https://d3i4yxtzktqr9n.cloudfront.net/${project.name}`,
      });
      await copy(
        file,
        resolve(`${root}/udeploy/pinocchio/${project.name}.yaml`)
      );
      await removeFile(`${root}/projects/${project.name}/udeploy`);
    }),
    step('codemod sentry configuration', async () => {
      await replaceNunjucksFile(
        `${root}/projects/${project.name}/src/config/sentry.js`,
        {
          name: project.name,
        }
      );
    }),
    step('codemod udeploy config file', async () => {
      const yaml = await readFile(`${root}/udeploy/config/udeploy.yaml`);
      const configs = yaml.match(/.+\n.+/g);
      configs.push(`${project.name}:\n  startup_time_wait: 15`);
      await writeFile(
        `${root}/udeploy/config/udeploy.yaml`,
        configs.sort().join('\n')
      );
    }),
    step('update monorepo manifest.json', async () => {
      await addMonorepoProject({
        root,
        project: project.name,
      });
    }),
    step('install deps', async () => {
      // eslint-disable-next-line no-console
      console.log('Template scaffolded.');
      if (!skipInstall) {
        // eslint-disable-next-line no-console
        console.log('Installing dependencies. This may take a few seconds...');
        try {
          await exec(`jazelle install --cwd projects/${project.name}`, {
            cwd: root,
            stdio: 'inherit',
          });
          // eslint-disable-next-line no-console
          console.log(
            `Done. Run \`cd projects/${project.name} && jazelle dev\` to start`
          );
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(
            `Scaffolded successfully, but \`jazelle install\` failed.`
          );
          // eslint-disable-next-line no-console
          console.log(
            `Run \`cd projects/${project.name} && jazelle install\` to troubleshoot`
          );
        }
      }
    }),
  ]);

  await stepper.run();
};
