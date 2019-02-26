const fs = require('fs');
const path = require('path');
const get = require('just-safe-get');
const codemodStep = require('./utils/codemod-step.js');
const composeSteps = require('./utils/compose-steps.js');
const fixEslintConfig = require('./utils/fix-eslint-config.js');
const addFusionRC = require('./commands/add-fusionrc.js');
const format = require('./utils/lint-fix.js');
const getConfigCodemod = require('./codemods/config/plugin.js');
const loadConfig = require('./utils/load-config.js');
const routesMatcher = require('./matchers/match-routes/match-routes.js');
const matchRenderType = require('./matchers/match-render-type/match-render-type.js');
const modRenderPageSkeletonCompat = require('./codemods/compat-plugin-render-page-skeleton/plugin.js');
const modInitialStateCompat = require('./codemods/compat-plugin-redux-state/plugin.js');
const modTeamName = require('./codemods/team-name/plugin.js');
const modAssetUrl = require('./codemods/bedrock-asset-url/plugin.js');
const modCdnUrl = require('./codemods/bedrock-cdn-url/plugin.js');
const modUberXhrCompat = require('./codemods/compat-plugin-uber-xhr/plugin.js');
const modRenameUberXhr = require('./codemods/rename-uber-xhr/plugin.js');
const modPrefixUrl = require('./codemods/bedrock-prefix-url/plugin.js');
const modBedrockCompat = require('./codemods/bedrock-compat/plugin.js');
const modCompatHttpHandler = require('./codemods/compat-plugin-http-handler/plugin.js');
const modCompatUniversalLogger = require('./codemods/compat-plugin-universal-logger/plugin.js');
const modCompatUniversalM3 = require('./codemods/compat-plugin-universal-m3/plugin.js');
const modReplaceRouterImports = require('./codemods/replace-react-router-imports/plugin.js');
const modCompatRPC = require('./codemods/compat-plugin-rpc/plugin.js');
const modCspExport = require('./codemods/csp-export/plugin.js');
const modDataDependency = require('./codemods/data-dependency/plugin.js');
const modReactHead = require('./codemods/react-head/plugin.js');
const modRemoveBedrockRenderer = require('./codemods/remove-bedrock-renderer/plugin.js');
const modProxies = require('./codemods/compat-plugin-proxies/plugin.js');
const modRpc = require('./codemods/bedrock-rpc/plugin.js');
const modHoistRoutes = require('./codemods/hoist-routes/plugin.js');
const modIndexRedirect = require('./codemods/mod-index-redirect/plugin.js');
const modRedirect = require('./codemods/mod-redirect/plugin.js');
const modIndexRoute = require('./codemods/mod-index-route/plugin.js');
const modReactRouter = require('./codemods/mod-react-router-4/plugin.js');
const modMainImports = require('./codemods/main-imports/plugin.js');
const modRegisterInitialStatePlugin = require('./codemods/register-initial-state-plugin/plugin.js');
const modSentryConfig = require('./codemods/sentry-config/plugin.js');
const modUniversalLogger = require('./codemods/bedrock-universal-logger/plugin.js');
const modUniversalM3 = require('./codemods/bedrock-universal-m3/plugin.js');
const modRemoveMagellanReducer = require('./codemods/remove-magellan-reducer/plugin.js');
const modRedux = require('./codemods/redux/plugin.js');
const modI18n = require('./codemods/isomorphic-i18n/plugin.js');
const modRemoveInternalToolLayout = require('./codemods/remove-internal-tool-layout/plugin.js');
const modRemoveStyletron = require('./codemods/remove-styletron-react-plugin/plugin.js');
const modFixTracer = require('./codemods/fix-tracer/plugin.js');
const modAddLegacyStyletronMixin = require('./codemods/add-legacy-styletron-mixin/plugin.js');
const lintFix = require('./commands/lint-fix.js');
const updateDeps = require('./commands/update-deps.js');
const updateEngines = require('./commands/update-engines.js');
const updateFiles = require('./commands/update-files.js');
const updateScripts = require('./commands/update-scripts.js');
const addNoFlowAnnotation = require('./commands/no-flow.js');
const updateGitignore = require('./commands/update-gitignore.js');
const setRoutePrefix = require('./commands/route-prefix.js');
const setServiceId = require('./commands/svc-id.js');
const replaceExportDefaultTemplate = require('./codemods/export-default-template/replace.js');
const resetExportDefaultTemplate = require('./codemods/export-default-template/reset.js');

module.exports = function getSteps(options) {
  options.config = loadConfig(options.destDir);
  const sharedSteps = [
    replaceExportDefaultTemplate,
    getStep('update-gitignore', () => updateGitignore(options)),
    getStep('update-files', () => updateFiles(options)),
    getStep('update-engines', () => updateEngines(options)),
    getStep('update-scripts', () => updateScripts(options)),
    getStep('fix-eslint-config', () => fixEslintConfig(options.destDir)),
    getStep('add-fusionrc', () => addFusionRC(options)),
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
    .concat(resetExportDefaultTemplate);
};

function get14Steps(options) {
  const {config} = options;
  const state = {};
  const hasProxies =
    get(config, 'dev.server.proxies') ||
    get(config, 'common.server.proxies') ||
    get(config, 'prod.server.proxies');

  const teamName = get(config, 'common.meta.team');
  const routePrefix = get(config, 'common.server.routePrefix');
  const svcId = get(config, 'common.meta.project');
  return [
    getStep('match-render-type', () =>
      codemodStep({...options, plugin: matchRenderType(state)})
    ),
    getStep('match-routes-file', () =>
      codemodStep({...options, plugin: routesMatcher(state)})
    ),
    getStep('redux-state-compat', () =>
      codemodStep({
        ...options,
        glob: 'src/app.js',
        plugin: modInitialStateCompat,
      })
    ),
    getStep('team-name', () =>
      codemodStep({
        ...options,
        glob: 'src/main.js',
        plugin: modTeamName(teamName),
      })
    ),
    routePrefix &&
      getStep('set-route-prefix', () =>
        setRoutePrefix({...options, routePrefix})
      ),
    getStep('set-svc-id', () => setServiceId({...options, svcId})),
    getConfigCodemodStep(options, 'clients.atreyu', 'src/config/atreyu.js'),
    getConfigCodemodStep(options, 'server.csp', 'src/config/secure-headers.js'),
    getStep('mod-csp-export', () =>
      codemodStep({...options, plugin: modCspExport})
    ),
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
        glob: 'src/main.js',
      })
    ),
    getStep(
      'mod-bedrock-compat',
      () => codemodStep({...options, plugin: modBedrockCompat}),
      () =>
        codemodStep({
          ...options,
          plugin: modCompatHttpHandler,
          glob: 'src/main.js',
        })
    ),
    getStep('mod-universal-m3', () =>
      codemodStep({...options, plugin: modUniversalM3})
    ),
    getStep('mod-compat-universal-m3', () =>
      codemodStep({
        ...options,
        plugin: modCompatUniversalM3,
        glob: 'src/main.js',
      })
    ),
    getStep('mod-sentry-config', () =>
      codemodStep({
        ...options,
        plugin: modSentryConfig(config),
        glob: 'src/config/sentry.js',
      })
    ),
    getStep('mod-remove-bedrock-renderer', () =>
      codemodStep({...options, plugin: modRemoveBedrockRenderer})
    ),
    getStep(
      'mod-add-skeleton-render-plugin',
      () =>
        state.renderType === 'renderPageSkeleton' &&
        codemodStep({
          ...options,
          plugin: modRenderPageSkeletonCompat(state),
          glob: 'src/main.js',
        })
    ),
    getStep('mod-data-dependency', () =>
      codemodStep({
        ...options,
        plugin: modDataDependency,
      })
    ),
    getStep('mod-react-head', () =>
      codemodStep({...options, plugin: modReactHead})
    ),
    getStep('mod-redirect', () =>
      codemodStep({
        ...options,
        plugin: modRedirect,
      })
    ),
    getStep('mod-index-redirect', () =>
      codemodStep({
        ...options,
        plugin: modIndexRedirect,
      })
    ),
    getStep('mod-index-route', () =>
      codemodStep({
        ...options,
        plugin: modIndexRoute,
      })
    ),
    getStep('mod-react-router', () =>
      codemodStep({
        ...options,
        plugin: modReactRouter,
      })
    ),
    getStep('mod-hoist-routes', () => {
      return codemodStep({
        ...options,
        plugin: modHoistRoutes(routePrefix),
        glob: state.routesFile,
        // glob: state.routesFile || 'src/components/routes.js',
      });
    }),
    getStep('mod-replace-router-imports', () =>
      codemodStep({
        ...options,
        plugin: modReplaceRouterImports,
      })
    ),
    getStep('mod-remove-magellan-reducer', () =>
      codemodStep({...options, plugin: modRemoveMagellanReducer})
    ),
    getStep('mod-compat-rpc', () =>
      codemodStep({
        ...options,
        plugin: modCompatRPC,
        glob: 'src/main.js',
      })
    ),
    getStep('mod-main-imports', () =>
      codemodStep({
        ...options,
        plugin: modMainImports(state),
        glob: 'src/main.js',
      })
    ),
    getStep('mod-app-imports', () =>
      codemodStep({
        ...options,
        plugin: modMainImports(state),
        glob: 'src/app.js',
      })
    ),
    getStep('mod-redux', () =>
      codemodStep({
        ...options,
        plugin: modRedux,
        glob: 'src/shared/store.js',
      })
    ),
    getStep('mod-isomorphic-i18n', () =>
      codemodStep({...options, plugin: modI18n})
    ),
    getStep('mod-remove-internal-tool-layout', () =>
      codemodStep({...options, plugin: modRemoveInternalToolLayout})
    ),
    getStep('mod-rename-uber-xhr', () =>
      codemodStep({
        ...options,
        plugin: modRenameUberXhr,
      })
    ),
    getStep('mod-uber-xhr-compat', () =>
      codemodStep({
        ...options,
        plugin: modUberXhrCompat,
        glob: 'src/main.js',
      })
    ),
    hasProxies &&
      getStep(
        'add-proxy-config',
        addFileStep(options, 'src/config/proxies.js')
      ),
    hasProxies &&
      getConfigCodemodStep(options, 'server.proxies', 'src/config/proxies.js'),
    hasProxies &&
      getStep('mod-compat-proxies', () =>
        codemodStep({
          ...options,
          plugin: modProxies,
          glob: 'src/main.js',
        })
      ),
    getStep('remove-styletron-plugin', () =>
      codemodStep({
        ...options,
        plugin: modRemoveStyletron,
        glob: 'src/main.js',
      })
    ),
    getStep('fix-tracer', () =>
      codemodStep({
        ...options,
        plugin: modFixTracer,
      })
    ),
    getStep('mod-register-initial-state-plugin', () =>
      codemodStep({
        ...options,
        plugin: modRegisterInitialStatePlugin,
        glob: 'src/app.js',
      })
    ),
    // This should be the final codemod as it changes the new App expression,
    // which means other codemods won't be able to find the new App expression
    getStep('add-legacy-styletron-mixin', () =>
      codemodStep({
        ...options,
        plugin: modAddLegacyStyletronMixin,
        glob: 'src/main.js',
      })
    ),
    getStep('add-no-flow-annotation', () => addNoFlowAnnotation(options)),
    getStep('lint-fix', () => lintFix(options)),
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
  return () =>
    fs.writeFileSync(path.join(options.destDir, file), 'export default {}');
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
        glob: file,
      }),
  };
}
