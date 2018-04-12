const codemodStep = require('./utils/codemod-step.js');
const diffStep = require('./commands/diff-step.js');
const getConfigCodemod = require('./codemods/config/plugin.js');
const modAssetUrl = require('./codemods/bedrock-asset-url/plugin.js');
const modCdnUrl = require('./codemods/bedrock-cdn-url/plugin.js');
const modCompatUniversalLogger = require('./codemods/compat-plugin-universal-logger/plugin.js');
const modCompatUniversalM3 = require('./codemods/compat-plugin-universal-m3/plugin.js');
const modRpc = require('./codemods/bedrock-rpc/plugin.js');
const modUniversalLogger = require('./codemods/bedrock-universal-logger/plugin.js');
const modUniversalM3 = require('./codemods/bedrock-universal-m3/plugin.js');
const updateDeps = require('./commands/update-deps.js');
const updateEngines = require('./commands/update-engines.js');
const updateFiles = require('./commands/update-files.js');
const updateScripts = require('./commands/update-scripts.js');

module.exports = function getSteps(options) {
  const sharedSteps = [
    {
      step: updateFiles.bind(null, options),
      id: 'update-files',
    },
    {
      step: updateEngines.bind(null, options),
      id: 'update-engines',
    },
    {
      step: updateScripts.bind(null, options),
      id: 'update-scripts',
    },
  ];
  let versionSpecificSteps = [];
  if (options.version === 14) {
    versionSpecificSteps = get14Steps(options);
  } else {
    versionSpecificSteps = get13Steps(options);
  }
  return sharedSteps
    .concat(versionSpecificSteps)
    .concat({
      step: updateDeps.bind(null, options),
      id: 'update-deps',
    })
    .reduce((prev, next) => {
      prev.push(next);
      prev.push({
        id: `${next.id}-diff`,
        step: diffStep.bind(null, next.id, options.destDir),
      });
      return prev;
    }, []);
};

function get14Steps(options) {
  return [
    getConfigCodemodStep(options, 'clients.atreyu', 'src/config/atreyu.js'),
    getConfigCodemodStep(options, 'server.csp', 'src/config/secure-headers.js'),
    getConfigCodemodStep(
      options,
      'clients.logtron.sentry',
      'src/config/sentry.js'
    ),
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
      id: 'mod-compat-universal-logger',
      step: codemodStep.bind(null, {
        ...options,
        plugin: modCompatUniversalLogger,
      }),
    },
    {
      id: 'mod-universal-m3',
      step: codemodStep.bind(null, {...options, plugin: modUniversalM3}),
    },
    {
      id: 'mod-compat-universal-m3',
      step: codemodStep.bind(null, {
        ...options,
        plugin: modCompatUniversalM3,
      }),
    },
  ];
}

function get13Steps() {
  return [];
}

function getConfigCodemodStep(options, keyPath, file) {
  const mod = getConfigCodemod({
    dir: options.destDir,
    keyPath,
  });
  return {
    id: `mod-${keyPath}-config`,
    step: codemodStep.bind(null, {
      ...options,
      plugin: mod,
      filter: filterMatchFile(file),
    }),
  };
}

function filterMatchFile(expected) {
  return function _filterMatchFile(f) {
    return f === expected;
  };
}
