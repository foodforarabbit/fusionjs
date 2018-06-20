const codemodStep = require('./utils/codemod-step.js');
const modCsrfIgnoreRoutes = require('./codemods/add-csrf-ignore-routes-token/plugin.js');
const modHelmet = require('./codemods/add-react-helmet-async/plugin.js');
const modReduxEnhancer = require('./codemods/expose-redux-from-enhancer/plugin.js');
const modHealthPathCheck = require('./codemods/fix-health-path-check/plugin.js');
const modLogtronBackend = require('./codemods/remove-logtron-backend-config-wrapping/plugin.js');
const modHelmetMigrations = require('./codemods/helmet-migrations/plugin.js');
const modPluginRemovals = require('./codemods/plugin-removals/plugin.js');

const flowConfigStep = require('./utils/flowconfig-step.js');
const addFlowLibdefsToConfig = require('./commands/add-flow-libdefs-to-config.js');
const updateDeps = require('./commands/update-deps.js');
const updateFiles = require('./commands/update-files.js');
const format = require('./utils/format.js');

module.exports = function getUpgrades({srcDir, destDir}) {
  return [
    async () => {
      await updateDeps({
        srcDir,
        destDir,
        modulesToRemove: ['@uber/fusion-codemods'],
      });
    },
    async () => {
      await codemodStep({
        destDir,
        plugin: modCsrfIgnoreRoutes,
        filter: f => f.endsWith('src/main.js'),
      });
    },
    async () => {
      const modulesToAdd = ['fusion-plugin-react-helmet-async'];
      await Promise.all([
        updateDeps({srcDir, destDir, modulesToAdd}),
        codemodStep({
          destDir,
          plugin: modHelmet,
          filter: f => f.endsWith('src/main.js'),
        }),
      ]);
    },
    async () => {
      await codemodStep({
        destDir,
        plugin: modReduxEnhancer,
        filter: f => f.endsWith('src/main.js'),
      });
    },
    async () => {
      await codemodStep({
        destDir,
        plugin: modHealthPathCheck,
        filter: f => f.endsWith('src/plugins/health.js'),
      });
    },
    async () => {
      await codemodStep({
        destDir,
        plugin: modLogtronBackend,
        filter: f => f.endsWith('src/main.js'),
      });
    },
    async () => {
      await codemodStep({
        destDir,
        plugin: modHelmetMigrations,
        filter: f => f.endsWith('src/components/root.js'),
      });
      await codemodStep({
        destDir,
        plugin: modPluginRemovals,
        filter: f => f.endsWith('src/app.js'),
      });
      await updateFiles({
        srcDir,
        destDir,
        remove: [
          'src/plugins/css-reset.js',
          'src/plugins/favicon.js',
          'src/plugins/full-height.js',
        ],
      });
      await flowConfigStep({
        destDir,
        plugin: addFlowLibdefsToConfig,
      });
    },
    async () => format(destDir),
  ];
};
