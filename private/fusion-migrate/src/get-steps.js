const fs = require('fs');
const path = require('path');
const get = require('just-safe-get');
const codemodStep = require('./utils/codemod-step.js');
const composeSteps = require('./utils/compose-steps.js');
const diffStep = require('./commands/diff-step.js');
const format = require('./utils/format.js');
const getConfigCodemod = require('./codemods/config/plugin.js');
const loadConfig = require('./utils/load-config.js');
const modAssetUrl = require('./codemods/bedrock-asset-url/plugin.js');
const modCdnUrl = require('./codemods/bedrock-cdn-url/plugin.js');
const modPrefixUrl = require('./codemods/bedrock-prefix-url/plugin.js');
const modBedrockCompat = require('./codemods/bedrock-compat/plugin.js');
const modCompatHttpHandler = require('./codemods/compat-plugin-http-handler/plugin.js');
const modCompatUniversalLogger = require('./codemods/compat-plugin-universal-logger/plugin.js');
const modCompatUniversalM3 = require('./codemods/compat-plugin-universal-m3/plugin.js');
const modReactHead = require('./codemods/react-head/plugin.js');
const modIsorender = require('./codemods/bedrock-isorender/plugin.js');
const modProxies = require('./codemods/compat-plugin-proxies/plugin.js');
const modRpc = require('./codemods/bedrock-rpc/plugin.js');
const modSentryConfig = require('./codemods/sentry-config/plugin.js');
const modUniversalLogger = require('./codemods/bedrock-universal-logger/plugin.js');
const modUniversalM3 = require('./codemods/bedrock-universal-m3/plugin.js');
const updateDeps = require('./commands/update-deps.js');
const updateEngines = require('./commands/update-engines.js');
const updateFiles = require('./commands/update-files.js');
const updateScripts = require('./commands/update-scripts.js');

module.exports = function getSteps(options) {
  options.config = loadConfig(options.destDir);
  const sharedSteps = [
    getStep('update-files', () => updateFiles(options)),
    getStep('update-engines', () => updateEngines(options)),
    getStep('update-scripts', () => updateScripts(options)),
    getStep('prettier', () => format(options.destDir)),
  ];
  let versionSpecificSteps = [];
  if (options.version === 14) {
    versionSpecificSteps = get14Steps(options);
  } else {
    versionSpecificSteps = get13Steps(options);
  }
  return sharedSteps
    .concat(versionSpecificSteps)
    .concat(getStep('update-deps', () => updateDeps(options)))
    .reduce((prev, next) => {
      prev.push(next);
      // run prettier on changed files after every step, other than the prettier step
      if (next.id !== 'prettier') {
        prev.push(
          getStep(`${next.id}-prettier`, () =>
            format(options.destDir, {changedOnly: true})
          )
        );
      }
      // pause and show diff after every step
      prev.push(
        getStep(`${next.id}-diff`, () => diffStep(next.id, options.destDir))
      );
      return prev;
    }, []);
};

function get14Steps(options) {
  const {config} = options;
  const hasProxies =
    get(config, 'dev.server.proxies') ||
    get(config, 'common.server.proxies') ||
    get(config, 'prod.server.proxies');
  return [
    getConfigCodemodStep(options, 'clients.atreyu', 'src/config/atreyu.js'),
    getConfigCodemodStep(options, 'server.csp', 'src/config/secure-headers.js'),
    getStep('mod-asset-url', () =>
      codemodStep({...options, plugin: modAssetUrl})
    ),
    getStep('mod-cdn-url', () => codemodStep({...options, plugin: modCdnUrl})),
    getStep('mod-prefix-url', () =>
      codemodStep({...options, plugin: modPrefixUrl})
    ),
    getStep('mod-rpc', () => codemodStep({...options, plugin: modRpc})),
    getStep('mod-universal-logger', () =>
      codemodStep({...options, plugin: modUniversalLogger})
    ),
    getStep('mod-compat-universal-logger', () =>
      codemodStep({
        ...options,
        plugin: modCompatUniversalLogger,
      })
    ),
    getStep(
      'mod-bedrock-compat',
      () => codemodStep({...options, plugin: modBedrockCompat(14)}),
      () =>
        codemodStep({
          ...options,
          plugin: modCompatHttpHandler,
          filter: filterMatchFile('src/main.js'),
        })
    ),
    getStep('mod-universal-m3', () =>
      codemodStep({...options, plugin: modUniversalM3})
    ),
    getStep('mod-compat-universal-m3', () =>
      codemodStep({
        ...options,
        plugin: modCompatUniversalM3,
      })
    ),
    getStep('mod-sentry-config', () =>
      codemodStep({
        ...options,
        plugin: modSentryConfig,
        filter: filterMatchFile('src/config/sentry.js'),
      })
    ),
    getStep('mod-isorender', () =>
      codemodStep({...options, plugin: modIsorender})
    ),
    getStep('mod-react-head', () =>
      codemodStep({...options, plugin: modReactHead})
    ),
    hasProxies &&
      getStep(
        'mod-compat-proxies',
        addFileStep(options, 'src/config/proxies.js'),
        getConfigCodemodStep(
          options,
          'server.proxies',
          'src/config/proxies.js'
        ),
        () =>
          codemodStep({
            ...options,
            plugin: modProxies,
          })
      ),
  ].filter(Boolean);
}

function get13Steps() {
  return [];
}

function getStep(id, ...steps) {
  let step = steps.length > 1 ? composeSteps(...steps) : steps[0];
  return {
    id,
    step,
  };
}

function addFileStep(options, file) {
  return () => fs.writeFileSync(path.join(options.destDir, file), '');
}

function getConfigCodemodStep(options, keyPath, file) {
  const mod = getConfigCodemod({
    config: options.config,
    keyPath,
  });
  return {
    id: `mod-${keyPath}-config`,
    step: () =>
      codemodStep({
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
