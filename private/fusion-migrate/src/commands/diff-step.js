const chalk = require('chalk');
const execa = require('execa');
const inquirer = require('inquirer');
const log = require('../log.js');

async function diffStep({name, destDir, pause}) {
  await execa.shell('git add .', {cwd: destDir});
  try {
    await execa.shell('git diff-index --quiet HEAD', {cwd: destDir});
  } catch (e) {
    pause && (await promptStep(name, destDir));
    await execa.shell(`git commit --no-verify -m 'Step "${name}"'`, {
      cwd: destDir,
    });
    return true;
  }
  return false;
}

async function promptStep(name, dir) {
  log('------------------------------------------------------------------\n');

  await execa.shell('git --no-pager diff HEAD', {
    stdio: 'inherit',
    cwd: dir,
  });

  log('------------------------------------------------------------------\n');
  log(chalk.bold.underline(`Finished running step ${name}. Diff shown above`));

  const {result} = await inquirer.prompt({
    name: 'result',
    type: 'confirm',
    message: `Continue?`,
  });

  if (result) {
    return true;
  } else {
    throw new Error(`User quit after running step: ${name}`);
  }
}

module.exports = diffStep;
