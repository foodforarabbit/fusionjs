const codemodStep = require('./utils/codemod-step.js');
const diffStep = require('./commands/diff-step.js');
const modAssetUrl = require('./codemods/bedrock-asset-url/plugin.js');
const modCdnUrl = require('./codemods/bedrock-cdn-url/plugin.js');
const modRpc = require('./codemods/bedrock-rpc/plugin.js');
const modUniversalLogger = require('./codemods/bedrock-universal-logger/plugin.js');
const modUniversalM3 = require('./codemods/bedrock-universal-m3/plugin.js');
const updateDeps = require('./commands/update-deps.js');
const updateEngines = require('./commands/update-engines.js');
const updateScripts = require('./commands/update-scripts.js');

module.exports = function getSteps(options) {
  const sharedSteps = getSharedSteps(options);
  let versionSpecificSteps = [];
  if (options.version === 14) {
    versionSpecificSteps = get14Steps(options);
  } else {
    versionSpecificSteps = get13Steps(options);
  }
  return sharedSteps.concat(versionSpecificSteps).reduce((prev, next) => {
    prev.push(next);
    prev.push({
      id: `${next.id}-diff`,
      step: diffStep.bind(null, next.id, options.destDir),
    });
    return prev;
  }, []);
};

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
      step: codemodStep.bind(null, {...options, plugin: modAssetUrl}),
    },
    {
      id: 'mod-cdn-url',
      step: codemodStep.bind(null, {...options, plugin: modCdnUrl}),
    },
    {
      id: 'mod-rpc',
      step: codemodStep.bind(null, {...options, plugin: modRpc}),
    },
    {
      id: 'mod-universal-logger',
      step: codemodStep.bind(null, {...options, plugin: modUniversalLogger}),
    },
    {
      id: 'mod-universal-m3',
      step: codemodStep.bind(null, {...options, plugin: modUniversalM3}),
    },
  ];
}

function get13Steps() {
  return [];
}
