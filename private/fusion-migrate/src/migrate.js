const chalk = require('chalk');
const StepRunner = require('./utils/step-runner.js');
const checkMigrationVersion = require('./commands/check-migration-version.js');
const codemodStep = require('./utils/codemod-step.js');
const log = require('./log.js');
const modAssetUrl = require('./codemods/bedrock-asset-url/plugin.js');
const modCdnUrl = require('./codemods/bedrock-cdn-url/plugin.js');
const modRpc = require('./codemods/bedrock-rpc/plugin.js');
const modUniversalLogger = require('./codemods/bedrock-universal-logger/plugin.js');
const modUniversalM3 = require('./codemods/bedrock-universal-m3/plugin.js');
const scaffold = require('./utils/scaffold.js');
const updateDeps = require('./commands/update-deps.js');
const updateEngines = require('./commands/update-engines.js');
const updateScripts = require('./commands/update-scripts.js');

module.exports = async function(/*name, sub, options*/) {
  // TODO: add support for a --dir option
  const destDir = process.cwd();
  const {error, version} = checkMigrationVersion(destDir);
  if (error) {
    log(chalk.red(error));
    return;
  }
  const srcDir = await scaffold();
  if (version === 13) {
    log(
      chalk.red(
        'Automatic migration of bedrock 13 projects is not supported yet'
      )
    );
    return;
  }
  const steps = getSteps({destDir, srcDir, version});
  if (await migrate({destDir, steps})) {
    log(chalk.green('Successfully ran all migration steps'));
  }
};

async function migrate({destDir, steps}) {
  const runner = new StepRunner(destDir);
  let stepIndex = 0;
  let currentStep = steps[stepIndex];
  while (currentStep && (await runner.step(currentStep.step, currentStep.id))) {
    stepIndex++;
    currentStep = steps[stepIndex];
  }
  if (!currentStep) {
    return true;
  }
  return false;
}

module.exports.migrate = migrate;

function getSteps(options) {
  const sharedSteps = getSharedSteps(options);
  let versionSpecificSteps = [];
  if (options.version === 14) {
    versionSpecificSteps = get14Steps(options);
  } else {
    versionSpecificSteps = get13Steps(options);
  }
  return sharedSteps.concat(versionSpecificSteps);
}

function getSharedSteps(options) {
  return [
    {
      step: updateEngines.bind(null, options),
      id: 'update-engines',
    },
    {
      step: updateScripts.bind(null, options),
      id: 'update-scripts',
    },
    {
      step: updateDeps.bind(null, options),
      id: 'update-deps',
    },
  ];
}

function get14Steps(options) {
  return [
    {
      id: 'mod-asset-url',
      step: () => codemodStep({...options, plugin: modAssetUrl}),
    },
    {
      id: 'mod-cdn-url',
      step: () => codemodStep({...options, plugin: modCdnUrl}),
    },
    {
      id: 'mod-rpc',
      step: () => codemodStep({...options, plugin: modRpc}),
    },
    {
      id: 'mod-universal-logger',
      step: () => codemodStep({...options, plugin: modUniversalLogger}),
    },
    {
      id: 'mod-universal-m3',
      step: () => codemodStep({...options, plugin: modUniversalM3}),
    },
  ];
}

function get13Steps() {
  return [];
}
