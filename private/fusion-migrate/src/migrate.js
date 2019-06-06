const fs = require('fs');
const execa = require('execa');
const path = require('path');
const chalk = require('chalk');
const StepRunner = require('./utils/step-runner.js');
const checkMigrationVersion = require('./commands/check-migration-version.js');
const getSteps = require('./get-steps.js');
const getLintSteps = require('./get-lint-steps.js');
const getTestSteps = require('./get-test-steps.js');
const log = require('./log.js');
const scaffold = require('./utils/scaffold.js');

const megaSteps = ['lint', 'test', 'main'];

module.exports = async function(name, sub, options) {
  if (options.steps.length && options.skipSteps.length) {
    log(chalk.red('Cant specify both --steps and --skip-steps'));
    return false;
  }
  // TODO: add support for a --dir option
  const destDir = options.dir || process.cwd();
  const reportPath = path.join(destDir, 'migration-report.json');

  let report = {};
  if (fs.existsSync(reportPath)) {
    report = JSON.parse(fs.readFileSync(reportPath).toString());
  }
  let version = report.version;
  if (!version) {
    const result = checkMigrationVersion(destDir);
    if (result.error) {
      log(chalk.red(result.error));
      return false;
    }
    version = result.version;
  }
  if (version === 13) {
    log(
      chalk.red(
        'Automatic migration of bedrock 13 projects is not supported yet'
      )
    );
    return false;
  }
  const srcDir = await scaffold();
  let steps = [];
  let migrationPart;
  if (!report.lastCompletedStep) {
    // engines migration
    steps = getLintSteps({destDir, srcDir});
    migrationPart = 1;
  } else if (report.lastCompletedStep === 'lint') {
    // test migration
    steps = getTestSteps({destDir, srcDir});
    migrationPart = 2;
  } else if (report.lastCompletedStep === 'test') {
    steps = getSteps({destDir, srcDir, version});
    migrationPart = 3;
    // code migration
  } else {
    log(
      chalk.red(
        `Unknown lastCompletedStep ${
          report.lastCompletedStep
        } in migration-report.json`
      )
    );
    return false;
  }
  steps = steps.filter(step => {
    if (options.skipSteps.length && options.skipSteps.includes(step.id)) {
      return false;
    }
    if (options.steps.length && !options.steps.includes(step.id)) {
      return false;
    }
    return true;
  });
  if (await migrate({destDir, report, steps, migrationPart})) {
    log(
      chalk.green(
        `Successfully ran migration part ${migrationPart}/${megaSteps.length}`
      )
    );
    return true;
  }
  return false;
};

async function migrate({destDir, steps, report, migrationPart}) {
  const runner = new StepRunner(destDir, report);
  let stepIndex = 0;
  let currentStep = steps[stepIndex];

  while (
    currentStep &&
    (await runner.step(currentStep.step, currentStep.id || currentStep.name))
  ) {
    stepIndex++;
    currentStep = steps[stepIndex];
  }
  if (!currentStep) {
    report.lastCompletedStep = megaSteps[migrationPart - 1];
    const reportPath = path.join(destDir, 'migration-report.json');
    if (report.lastCompletedStep === 'main') {
      fs.unlinkSync(reportPath);
      log(chalk.green('Migration complete'));
    } else {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    }
    await execa.shell(
      `git add . && git commit --no-edit --no-verify -m "Fusion migration step ${migrationPart}/${
        megaSteps.length
      }"`
    );
    return true;
  }
  return false;
}

module.exports.migrate = migrate;
