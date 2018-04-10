const execa = require('execa');
const inquirer = require('inquirer');

async function diffStep(name, dir) {
  await execa.shell('git add .', {cwd: dir});
  await promptStep(name, dir);
  await execa.shell(`git commit -m 'Step "${name}"'`, {cwd: dir});
  return true;
}

async function promptStep(name, dir) {
  const {action} = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: `Finished running ${name}`,
    choices: ['Continue', 'Show Diff', 'Quit'],
  });

  if (action === 'Show Diff') {
    await execa.shell('git --no-pager diff HEAD', {
      stdio: 'inherit',
      cwd: dir,
    });
    return promptStep(name);
  } else if (action == 'Quit') {
    throw new Error(`User quit after running step: ${name}`);
  } else {
    return true;
  }
}

module.exports = diffStep;
