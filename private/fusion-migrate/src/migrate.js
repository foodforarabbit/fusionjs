const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const StepRunner = require('./utils/step-runner.js');
const checkMigrationVersion = require('./commands/check-migration-version.js');
const getSteps = require('./get-steps.js');
const log = require('./log.js');
const scaffold = require('./utils/scaffold.js');
const progress = require('cli-progress');

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
    if (options.steps.length) {
      log(
        chalk.red(
          'Cannot run specific steps and recover from previous migration. Run `rm migration-report.json` to remove old migration report'
        )
      );
      return false;
    }
    report = JSON.parse(fs.readFileSync(reportPath).toString());
    if (report.completedSteps) {
      options.skipSteps = options.skipSteps.concat(report.completedSteps);
    }
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
  const steps = getSteps({destDir, srcDir, version}).filter(step => {
    if (options.skipSteps.length && options.skipSteps.includes(step.id)) {
      return false;
    }
    if (options.steps.length && !options.steps.includes(step.id)) {
      return false;
    }
    return true;
  });
  if (await migrate({destDir, version, steps})) {
    log(chalk.green('Successfully ran all migration steps'));
    return true;
  }
  return false;
};

async function migrate({destDir, steps, version}) {
  const runner = new StepRunner(destDir, version);
  let stepIndex = 0;
  let currentStep = steps[stepIndex];
  const bar = new progress.Bar(
    {
      format: 'progress [{bar}] {percentage}% | {step}',
    },
    progress.Presets.shades_classic
  );

  bar.start(steps.length, -1, {
    step: currentStep.id,
  });
  while (currentStep && (await runner.step(currentStep.step, currentStep.id))) {
    bar.increment(1, {
      step: currentStep.id,
    });
    stepIndex++;
    currentStep = steps[stepIndex];
  }
  bar.stop();
  if (!currentStep) {
    return true;
  }
  return false;
}

module.exports.migrate = migrate;
